var moment = require('moment')
const PRIMARY = 'primary'
const GENERAL = 'general'
const allData = []
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

var Promise = require('promise');
var csv = require('csv-parse');
var fs = require('fs');

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

function votedInYear(elections, year, type) {
    return elections[year][type]
}

// Last time voted in primary
// Last time voted in general
(async function run() {
    const yearStats = {        
        '2010': {
            total: 0,
            lastTimeVoted: {
                primary: {},
                general: {}
            },
            previousVotes: {
                primary: {},
                general: {}
            },
            frequencySinceReg: {
                primary: {},
                general: {}
            },
            regDate: {
                primary: {},
                general: {}
            }
        },
        '2014': {
            total: 0,
            lastTimeVoted: {
                primary: {},
                general: {}
            },
            previousVotes: {
                primary: {},
                general: {}
            },
            frequencySinceReg: {
                primary: {},
                general: {}
            },
            regDate: {
                primary: {},
                general: {}
            }
        }
    }

    const modelYears = Object.keys(yearStats)

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

        /*if (votedInYear(elections, 2014, PRIMARY)) {
            let numPrevVotes = 0
            for (let prev = 1990; prev < 2014; prev++) {
                if (votedInYear(elections, prev, PRIMARY)) {
                    numPrevVotes += 1
                }
            }
            if (!totalPreviousVotes.hasOwnProperty(numPrevVotes)) {
                totalPreviousVotes[numPrevVotes] = 0
            }

            totalPreviousVotes[numPrevVotes] += 1
        }    */  
          
        modelYears.forEach((year) => {
            var voted = false
            if (elections[year][PRIMARY]) {
                yearStats[year].total += 1
                voted = true
            }


            [PRIMARY, GENERAL].forEach((electionType) => {
                for (let lastVoteInterval = 1; lastVoteInterval <= year - 1995; lastVoteInterval++) {
                    if (!yearStats[year].lastTimeVoted[electionType].hasOwnProperty(lastVoteInterval)) {
                        yearStats[year].lastTimeVoted[electionType][lastVoteInterval] = {
                            total: 0,
                            totalWhoVotedInModelYear: 0
                        }
                    }
                    let didntVoteBeforeInterval = true
                    for (let interval = 1; interval < lastVoteInterval; interval++) {
                        if (votedInYear(elections, year - interval, electionType)) {
                            didntVoteBeforeInterval = false
                        }
                    }

                    if (didntVoteBeforeInterval) {
                        var votedInInterval = false
                        if (votedInYear(elections, year - lastVoteInterval, electionType)) {
                            votedInInterval = true
                        }
                       
                        if (votedInInterval) {
                            yearStats[year].lastTimeVoted[electionType][lastVoteInterval].total += 1
                            if (voted) {
                                yearStats[year].lastTimeVoted[electionType][lastVoteInterval].totalWhoVotedInModelYear += 1
                            }
                        }
                    }
                }

                for (let totalPrevVotes = 0; totalPrevVotes <= 25; totalPrevVotes++) {
                    if (!yearStats[year].previousVotes[electionType].hasOwnProperty(totalPrevVotes)) {
                        yearStats[year].previousVotes[electionType][totalPrevVotes] = {
                            total: 0,
                            totalWhoVotedInModelYear: 0
                        }
                    }
                }
                let totalPrevVotes = 0
                for (let y = year - 1; y >= year - 15; y--) {
                    if (elections[y][electionType]) {
                        totalPrevVotes += 1
                    }
                }
                yearStats[year].previousVotes[electionType][totalPrevVotes].total += 1
                if (voted) {
                    yearStats[year].previousVotes[electionType][totalPrevVotes].totalWhoVotedInModelYear += 1
                }

                for (let bucket = 0; bucket <= 25; bucket += 1) {
                    if (!yearStats[year].regDate[electionType].hasOwnProperty(bucket)) {
                        yearStats[year].regDate[electionType][bucket] = {
                            total: 0,
                            totalWhoVotedInModelYear: 0
                        }
                    }
                }

                let totalVotesSinceRegDate = 0
                let totalOpportunitiesSinceRegDate = 0
                for (let bucket = 0; bucket <= 100; bucket += 10) {
                    if (!yearStats[year].frequencySinceReg[electionType].hasOwnProperty(bucket))
                        yearStats[year].frequencySinceReg[electionType][bucket] = {
                            total: 0,
                            totalWhoVotedInModelYear: 0
                        }
                }
                Object.keys(elections).forEach((election) => {
                    if (parseInt(election, 10) < year) {
                        if (regDate.isBefore(moment(`06/01/${election}`, 'MM/DD/YYYY'))) {
                            totalOpportunitiesSinceRegDate += 1
                            if (elections[election][electionType] == true) {
                                totalVotesSinceRegDate += 1
                            }
                        }
                    }
                })
                if (totalOpportunitiesSinceRegDate > 2) {
                    const bucket = Math.ceil(totalVotesSinceRegDate / totalOpportunitiesSinceRegDate * 10) * 10
                    if (!isNaN(bucket)) {
                        yearStats[year].frequencySinceReg[electionType][bucket].total += 1
                        if (voted) {
                            yearStats[year].frequencySinceReg[electionType][bucket].totalWhoVotedInModelYear+= 1
                        }
                    } 
                }
                yearStats[year].regDate[electionType][totalOpportunitiesSinceRegDate].total += 1
                if (voted) {
                    yearStats[year].regDate[electionType][totalOpportunitiesSinceRegDate].totalWhoVotedInModelYear += 1
                }
            })
        })
    }

    Object.keys(yearStats).forEach((year) => {
        console.log('YEAR: ', year)
        console.log('Last time voted:')
        for (let key = 1; key <= 15; key++) {
            console.log(`${yearStats[year].lastTimeVoted[PRIMARY][key].totalWhoVotedInModelYear / yearStats[year].lastTimeVoted[PRIMARY][key].total}, ${yearStats[year].lastTimeVoted[GENERAL][key].totalWhoVotedInModelYear / yearStats[year].lastTimeVoted[GENERAL][key].total}`)
        }
        console.log('Previous votes:')
        for (let key = 0; key <= 25; key++) {
            console.log(`${key}, ${yearStats[year].previousVotes[PRIMARY][key].totalWhoVotedInModelYear / yearStats[year].previousVotes[PRIMARY][key].total}, ${yearStats[year].previousVotes[GENERAL][key].totalWhoVotedInModelYear / yearStats[year].previousVotes[GENERAL][key].total}`)
        }
        console.log('Reg date frequency:')
        for (let key = 0; key <= 100; key += 10) {
            console.log(`${yearStats[year].frequencySinceReg[PRIMARY][key].totalWhoVotedInModelYear / yearStats[year].frequencySinceReg[PRIMARY][key].total}, ${yearStats[year].frequencySinceReg[GENERAL][key].totalWhoVotedInModelYear / yearStats[year].frequencySinceReg[GENERAL][key].total}`)
        }
        console.log('Reg date:')
        for (let key = 0; key <= 25; key += 1) {
            console.log(`${yearStats[year].regDate[PRIMARY][key].totalWhoVotedInModelYear / yearStats[year].regDate[PRIMARY][key].total}, ${yearStats[year].regDate[GENERAL][key].totalWhoVotedInModelYear / yearStats[year].regDate[GENERAL][key].total}`)
        }
    })
})()
