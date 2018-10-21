library(glmnet)
library(caret)

# Where 'binarysupport' is looking at 1s for supporters and 0s for non-supporters
# Load entire file
mydatafull <- ny14
# Build table of ID'd cases only
mydata <- mydatafull[complete.cases(mydatafull$binarysupport), ]

library(Amelia)
missmap(mydata, main = "Missing values vs observed")

attach(mydata)

#Create new dataframe without certain columns and scores that don't have enough data
library(dplyr)
data <- select(mydata,-LastName,-FirstName,-MiddleName,-Suffix,-Primary_Alex_Support,-GE_Alex_Support,-X2016.DNCVolPrPhV4)

detach(mydata)

attach(data)

#Replace missing  values with average -- !! need to fix just for certain numeric values
for(i in 1:ncol(data)){
  data[is.na(data[,i]), i] <- mean(data[,i], na.rm = TRUE)
}

detach(data)

#Check df
str(data)

#Graph remaining missing values
missmap(data, main = "Updated Missing values vs observed")

# Split the data into training and test set
set.seed(123)
training.samples <- data$binarysupport %>% 
  createDataPartition(p = 0.8, list = FALSE)
train.data  <- data[training.samples, ]
test.data <- data[-training.samples, ]

# Dummy code categorical predictor variables and remove remaining non-predictors
x <- model.matrix(binarysupport~.-Voter.File.VANID-binarysupport-binary1ssupport-scalesupport-undecided, data)[,-1]
# Convert the outcome (class) to a numerical variable if needed
y <- data$binarysupport

#Check to make sure dfs match
nrow(x)==length(y)

#lasso
glmnet(x, y, family = "binomial", alpha = 1, lambda = NULL)

# Find the best lambda
set.seed(123) 
cv.lasso <- cv.glmnet(x, y, alpha = 1, family = "binomial")
# Fit the final model on the training data
model <- glmnet(x, y, alpha = 1, family = "binomial",
                lambda = cv.lasso$lambda.min)
# Display regression coefficients
coef(model)
# Make predictions on the test data
x.test <- model.matrix(binarysupport~.-Voter.File.VANID-binarysupport-binary1ssupport-scalesupport-undecided, test.data)[,-1]
probabilities <- model %>% predict(newx = x.test)
predicted.classes <- ifelse(probabilities > 0.5, 1, 0)
# Model accuracy
observed.classes <- test.data$binarysupport
mean(predicted.classes == observed.classes)

#Optimal value of lambda that minimizes the cross-validation error:

set.seed(123)
cv.lasso <- cv.glmnet(x, y, alpha = 1, family = "binomial")
plot(cv.lasso)

#Test lambdas
cv.lasso$lambda.min
cv.lasso$lambda.1se

#Using lambda.min as the best lambda, gives the following regression coefficients:

coef(cv.lasso, cv.lasso$lambda.min)

#Using lambda.1se as the best lambda, gives the following regression coefficients:

coef(cv.lasso, cv.lasso$lambda.1se)

# Final model with lambda.min
lasso.model <- glmnet(x, y, alpha = 1, family = "binomial",
                      lambda = cv.lasso$lambda.min)
# Make prediction on test data
x.test <- model.matrix(binarysupport~.-Voter.File.VANID-binarysupport-binary1ssupport-scalesupport-undecided, test.data)[,-1]
probabilities <- lasso.model %>% predict(newx = x.test)
predicted.classes <- ifelse(probabilities > 0.5, 1, 0)
# Model accuracy
observed.classes <- test.data$binarysupport
mean(predicted.classes == observed.classes)

#Compute the final model using lambda.1se

# Final model with lambda.1se
lasso.model <- glmnet(x, y, alpha = 1, family = "binomial",
                      lambda = cv.lasso$lambda.1se)

# Make prediction on test data
x.test <- model.matrix(binarysupport~.-Voter.File.VANID-binarysupport-binary1ssupport-scalesupport-undecided, test.data)[,-1]
probabilities <- lasso.model %>% predict(newx = x.test)
predicted.classes <- ifelse(probabilities > 0.5, 1, 0)
# Model accuracy rate
observed.classes <- test.data$binarysupport
mean(predicted.classes == observed.classes)

# Fit the final model
full.model <- glm(binarysupport~.-Voter.File.VANID-binarysupport-binary1ssupport-scalesupport-undecided, data = train.data, family = binomial)
# Make predictions
probabilities <- full.model %>% predict(test.data, type = "response")
predicted.classes <- ifelse(probabilities > 0.5, 1, 0)
# Model accuracy
observed.classes <- test.data$binarysupport
mean(predicted.classes == observed.classes)

#Predict Within the Original .CSV
predictions = cbind(data, pred = predict(full.model, newdata = data, type = "response"))
write.csv(predictions, "~/Desktop/R/predictions.csv", row.names = F)

#Plot
plot(predictions$pred,predictions$binarysupport, main = "Predictions vs. lsupport", xlab="Prediction",ylab="lsupport")

g=glm(binarysupport~pred,family=binomial,data=predictions)

curve(predict(g,data.frame(pred=x),type="resp"),add=TRUE)
