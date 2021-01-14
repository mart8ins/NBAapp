/*****************************
random score for simulating game
*****************************/
function randomScore(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}


/*****************************
function to simulate game
*****************************/
function simulateGame(newGame) {

    // arrays with teams title and its rating
    let team1 = newGame.team1.split(",");
    let team2 = newGame.team2.split(",");

    // team rating as a number for to affect winner/looser
    let team1Rating = parseInt(team1[1]);
    let team2Rating = parseInt(team2[1]);

    // if teams rating is 4, there will be 4 elements in array with teams name, other teams rating 2 - 2 names in array
    let ratingList = []

    // loops for teams ratings to fill ratinglist array
    for (let i = 1; i <= team1Rating; i++) {
        ratingList.push(team1[0])
    }
    for (let i = 1; i <= team2Rating; i++) {
        ratingList.push(team2[0])
    }

    // random number in range 0-... of ratingList length
    let determine = Math.round(Math.random() * ratingList.length);

    let winnerName = ratingList[determine];
    let looserName;
    for (let i in ratingList) {
        if (ratingList[determine] != ratingList[i]) looserName = ratingList[i];
    }

    // two random scores
    let score1 = randomScore(80, 130);
    let score2 = randomScore(80, 130);

    // overtime? if options is 1 and score diff is less than 10 than there is overtime
    // options - 0 or 1, refers to two teams, and also for true/false for overtime
    let isOvertime = Math.round(Math.random() * 1);
    let overtime = isOvertime == 1 && Math.abs(score1 - score2) < 10 ? true : false;

    return {
        winner: {
            team: winnerName,
            score: score1 > score2 ? score1 : score2 > score1 ? score2 : null
        },
        looser: {
            team: looserName,
            score: score1 < score2 ? score1 : score2 < score1 ? score2 : null
        },
        overtime: overtime
    }
}



module.exports = { randomScore, simulateGame }