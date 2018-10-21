var moment = require('moment')
var Promise = require('promise');
var csv = require('csv-parse');
var fs = require('fs');

const PRIMARY = 'primary'
const GENERAL = 'general'
const YEAR = 2018

const primaries = {
    '13thSDSpecial10': {year: 2010, type: PRIMARY},
    '9thCDSpecial11': {year: 2011, type: PRIMARY},
    'FederalPrimary16': {year: 2016, type: PRIMARY},
    'General17': {year: 2017, type: GENERAL},
    'General16': {year: 2016, type: GENERAL},
    'General15': {year: 2015, type: GENERAL},
    'General14': {year: 2014, type: GENERAL},
    'General13': {year: 2013, type: GENERAL},
    'General12': {year: 2012, type: GENERAL},
    'General11': {year: 2011, type: GENERAL},
    'General10': {year: 2010, type: GENERAL},
    'General09': {year: 2009, type: GENERAL},
    'General08': {year: 2008, type: GENERAL},
    'General07': {year: 2007, type: GENERAL},
    'General06': {year: 2006, type: GENERAL},
    'General05': {year: 2005, type: GENERAL},
    'General04': {year: 2004, type: GENERAL},
    'General03': {year: 2003, type: GENERAL},
    'General02': {year: 2002, type: GENERAL},
    'General01': {year: 2001, type: GENERAL},
    'General01': {year: 2001, type: GENERAL},
    'General00': {year: 2000, type: GENERAL},
    'General99': {year: 1999, type: GENERAL},
    'General98': {year: 1998, type: GENERAL},
    'General97': {year: 1997, type: GENERAL},
    'General96': {year: 1996, type: GENERAL},
    'General95': {year: 1995, type: GENERAL},
    'JunePrimary14': {year: 2014, type: PRIMARY},
    'JunePrimary12': {year: 2012, type: PRIMARY},
    'MuniGeneral06': {year: 2006, type: PRIMARY},
    'Municipal09': {year: 2009, type: PRIMARY},
    'Municipal08': {year: 2008, type: PRIMARY},
    'PresPrimary16': {year: 2016, type: PRIMARY},
    'PresPrimary12': {year: 2012, type: PRIMARY},
    'PresPrimary08': {year: 2008, type: PRIMARY},
    'PresPrimary04': {year: 2004, type: PRIMARY},
    'PresPrimary00': {year: 2000, type: PRIMARY},
    'PresPrimary96': {year: 1996, type: PRIMARY},
    'Primary17': {year: 2017, type: PRIMARY},
    'Primary16': {year: 2016, type: PRIMARY},
    'Primary15': {year: 2015, type: PRIMARY},
    'Primary14': {year: 2014, type: PRIMARY},
    'Primary13': {year: 2013, type: PRIMARY},
    'Primary12': {year: 2012, type: PRIMARY},
    'Primary11': {year: 2011, type: PRIMARY},
    'Primary10': {year: 2010, type: PRIMARY},
    'Primary10Party': {year: 2010, type: PRIMARY},
    'Primary09': {year: 2009, type: PRIMARY},
    'Primary08': {year: 2008, type: PRIMARY},
    'Primary07': {year: 2007, type: PRIMARY},
    'Primary06': {year: 2006, type: PRIMARY},
    'Primary05': {year: 2005, type: PRIMARY},
    'Primary04': {year: 2004, type: PRIMARY},
    'Primary03': {year: 2003, type: PRIMARY},
    'Primary02': {year: 2002, type: PRIMARY},
    'Primary01': {year: 2001, type: PRIMARY},
    'Primary00': {year: 2000, type: PRIMARY},
    'Primary99': {year: 1999, type: PRIMARY},
    'Primary98': {year: 1998, type: PRIMARY},
    'Primary97': {year: 1997, type: PRIMARY},
    'Primary96': {year: 1996, type: PRIMARY},
    'Primary95': {year: 1995, type: PRIMARY},
    'Runoff09': {year: 2009, type: PRIMARY},
    'SchoolBoard09': {year: 2009, type: PRIMARY},
    'SchoolBoard08': {year: 2008, type: PRIMARY},
    'SeptPrimary14': {year: 2014, type: PRIMARY},
    'SeptPrimary12': {year: 2012, type: PRIMARY},
    'Special17': {year: 2017, type: PRIMARY},
    'Special15': {year: 2015, type: PRIMARY},
    'Special11': {year: 2011, type: PRIMARY},
    'Special09': {year: 2009, type: PRIMARY},
    'Special08': {year: 2008, type: PRIMARY},
    'SpecialPrimary09': {year: 2009, type: PRIMARY}
}

const scores = {
    lastTimeVoted: {
        '0': {
            primary: 0.01499,
            general: 0.00670
        },
        '1': {
            primary: 0.45242,
            general: 0.31960
        },
        '2': {
            primary: 0.19084,
            general: 0.05357
        },
        '3': {
            primary: 0.08660,
            general: 0.10241
        },
        '4': {
            primary: 0.15904,
            general: 0.05342
        },
        '5': {
            primary: 0.07818,
            general: 0.03232
        },
        '6': {
            primary: 0.05926,
            general: 0.01098
        },
        '7': {
            primary: 0.04894,
            general: 0.03807
        },
        '8': {
            primary: 0.05855,
            general: 0.01796
        },
        '9': {
            primary: 0.04734,
            general: 0.01259
        },
        '10': {
            primary: 0.03923,
            general: 0.00833
        },
        '11': {
            primary: 0.00957,
            general: 0.00000
        },
        '12': {
            primary: 0.03317,
            general: 0.00917
        },
        '13': {
            primary: 0.01927,
            general: 0.01378
        },
        '14': {
            primary: 0.03966,
            general: 0.00579
        },
        '15': {
            primary: 0.00000,
            general: 0.00000
        }
    },
    frequencySinceReg: {
        '0': {
            primary: 0.01954,
            general: 0.00677
        },
        '10': {
            primary: 0.05888,
            general: 0.01676
        },
        '20': {
            primary: 0.10643,
            general: 0.02423
        },
        '30': {
            primary: 0.18902,
            general: 0.03846
        },
        '40': {
            primary: 0.27498,
            general: 0.05900
        },
        '50': {
            primary: 0.39687,
            general: 0.10225
        },
        '60': {
            primary: 0.54836,
            general: 0.15628
        },
        '70': {
            primary: 0.63800,
            general: 0.22906
        },
        '80': {
            primary: 0.71682,
            general: 0.35958
        },
        '90': {
            primary: 0.83999,
            general: 0.50836
        },
        '100': {
            primary: 0.84063,
            general: 0.62505
        }
    },
    numPrevVotes: {
        '0': {
            primary: 0.01499,
            general: 0.00670
        },
        '1': {
            primary: 0.08993,
            general: 0.03504
        },
        '2': {
            primary: 0.14100,
            general: 0.06720
        },
        '3': {
            primary: 0.19538,
            general: 0.06742
        },
        '4': {
            primary: 0.25772,
            general: 0.08713
        },
        '5': {
            primary: 0.31564,
            general: 0.11177
        },
        '6': {
            primary: 0.38714,
            general: 0.12952
        },
        '7': {
            primary: 0.44581,
            general: 0.14686
        },
        '8': {
            primary: 0.53843,
            general: 0.17777
        },
        '9': {
            primary: 0.61128,
            general: 0.21899
        },
        '10': {
            primary: 0.70983,
            general: 0.26592
        },
        '11': {
            primary: 0.74789,
            general: 0.34774
        },
        '12': {
            primary: 0.79450,
            general: 0.46444
        },
        '13': {
            primary: 0.86279,
            general: 0.58554
        },
        '14': {
            primary: 1.00000,
            general: 0.68162
        }
    },
    regDate: {
        '0': 0.02207996237,
        '1': 0.05157781296,      
        '2': 0.07624506752,
        '3': 0.08149771995,
        '4': 0.08831141551,
        '5': 0.05884691208,       
        '6': 0.07495006267,
        '7': 0.09385570526,
        '8': 0.09820700288,
        '9': 0.08913783052,
        '10': 0.1063301344,
        '11': 0.09658039215,
        '12': 0.1035231596,
        '13': 0.1102094975,
        '14': 0.1107682393,
        '15': 0.1490657064
    }
}

async function parseCSV(file) {
    return new Promise(function (resolve, reject) {
        var parser = csv({delimiter: ','},
            function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
                parser.end();
            });
        fs.createReadStream(file).pipe(parser);
    });
}

(async function run() {
    console.log(`VANID,lastPrimaryVoteScore,lastGeneralVoteScore,totalPrimaryVotesScore,totalGeneralVotesScore,primaryFrequencySinceRegScore,generalFrequencySinceRegScore,regDateScore`)
    var data = await parseCSV('/Users/saikat/Desktop/ALLDEMOCRATS.csv')
    const headers = data[0]
    for (let idx = 1; idx < data.length; idx++) {
        const row = data[idx]
        const regDate = moment(row[5], 'MM/DD/YY')
        const elections = {}
        for (let j = 0; j < row.length; j++) {
            if (primaries.hasOwnProperty(headers[j])) {
                electionObj = primaries[headers[j]]
                if (!elections.hasOwnProperty(electionObj.year)) {
                    elections[electionObj.year] = { primary: false, general: false }
                }
                if (row[j].trim() != '') {
                    elections[electionObj.year][electionObj.type] = true
                }
            }
        }
        let lastTimeVotedInPrimary = 0
        let lastTimeVotedInGeneral = 0
        let totalPrimaryVotes = 0
        let totalGeneralVotes = 0
        let totalPrimaryVotesSinceRegDate = 0
        let totalPrimaryOpportunitiesSinceRegDate = 0
        let totalGeneralVotesSinceRegDate = 0
        let totalGeneralOpportunitiesSinceRegDate = 0
        Object.keys(elections).forEach((year) => {
            if (regDate.isBefore(moment(`06/01/${year}`, 'MM/DD/YYYY'))) {
                totalPrimaryOpportunitiesSinceRegDate += 1
                totalGeneralOpportunitiesSinceRegDate += 1
                if (elections[year][PRIMARY] == true) {
                    totalPrimaryVotesSinceRegDate += 1
                }
                if (elections[year][GENERAL] == true) {
                    totalGeneralVotesSinceRegDate += 1
                }
            }
            if (elections[year].primary) {
                if (YEAR - year <= 15) {
                    totalPrimaryVotes += 1
                }
                if (year > lastTimeVotedInPrimary) {
                    lastTimeVotedInPrimary = year
                }
            }

            if (elections[year].general) {
                if (YEAR - year <= 15) {
                    totalGeneralVotes += 1
                }
                if (year > lastTimeVotedInGeneral) {
                    lastTimeVotedInGeneral = year
                }
            }
        })
        let primaryBucket = Math.ceil(totalPrimaryVotesSinceRegDate / totalPrimaryOpportunitiesSinceRegDate * 10) * 10
        let generalBucket = Math.ceil(totalGeneralVotesSinceRegDate / totalGeneralOpportunitiesSinceRegDate * 10) * 10
        if (isNaN(primaryBucket)) {
            primaryBucket = 0
        }
        if (isNaN(generalBucket)) {
            generalBucket = 0
        }

        if (lastTimeVotedInGeneral !== 0) {
            lastTimeVotedInGeneral = YEAR - lastTimeVotedInGeneral
        }
        if (lastTimeVotedInPrimary !== 0) {
            lastTimeVotedInPrimary = YEAR - lastTimeVotedInPrimary
        }        

        if (lastTimeVotedInPrimary > 15) {
            lastTimeVotedInPrimary = 15
        }
        if (lastTimeVotedInGeneral > 15) {
            lastTimeVotedInGeneral = 15
        }
        if (totalPrimaryVotes > 14) {
            totalPrimaryVotes = 14
        }
        if (totalGeneralVotes > 14) {
            totalGeneralVotes = 14
        }

        if (totalGeneralOpportunitiesSinceRegDate > 15) {
            totalGeneralOpportunitiesSinceRegDate = 15
        }
        
        let lastPrimaryVoteScore = scores.lastTimeVoted[lastTimeVotedInPrimary].primary
        let lastGeneralVoteScore = scores.lastTimeVoted[lastTimeVotedInGeneral].general            
        let totalPrimaryVotesScore = scores.numPrevVotes[totalPrimaryVotes].primary
        let totalGeneralVotesScore = scores.numPrevVotes[totalGeneralVotes].general
        let primaryFrequencySinceRegScore = scores.frequencySinceReg[primaryBucket].primary
        let generalFrequencySinceRegScore = scores.frequencySinceReg[generalBucket].general
        let regDateScore = scores.regDate[totalGeneralOpportunitiesSinceRegDate]
        console.log(`${row[0]},${lastPrimaryVoteScore},${lastGeneralVoteScore},${totalPrimaryVotesScore},${totalGeneralVotesScore},${primaryFrequencySinceRegScore},${generalFrequencySinceRegScore},${regDateScore}`)
    }
})()
