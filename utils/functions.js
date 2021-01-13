// random score for simulating game
function randomScore(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function simulateGame(newGame) {

    // array with teams title and its rating
    let team1 = newGame.team1.split(",");
    let team2 = newGame.team2.split(",");

    // rating range is 1-5, so if teams rating is 4, there will be 4 elements in array with teams name, other teams rating 2 - 2 names in array
    let ratingList = []

    // team rating to affect final score, but how????
    let team1Rating = parseInt(team1[1]);
    let team2Rating = parseInt(team2[1]);

    for (let i = 1; i <= team1Rating; i++) {
        ratingList.push(team1[0])
    }
    for (let i = 1; i <= team2Rating; i++) {
        ratingList.push(team2[0])
    }
    console.log(ratingList)

    /* JĀIZDOMĀ KĀ IEVIEST ŠĪ FUNKCIONALITĀTE NOSAKOT UZVARĒTĀJU AR RATINGA PALĪDZĪBU */
    // let options = Math.round(Math.random() * ratingList.length);





    /* !!!!! */
    // options - 0 or 1, refers to two teams
    let options = Math.round(Math.random() * 1);
    /* !!!!! */

    // two teams
    let teams = [team1[0], team2[0]];






    // two random scores
    let score1 = randomScore(80, 130);
    let score2 = randomScore(80, 130);

    // overtime? if options is 1 and score diff is less than 10 than there is overtime
    // options - 0 or 1, refers to two teams, and also for true/false for overtime
    let isOvertime = Math.round(Math.random() * 1);
    let overtime = isOvertime == 1 && Math.abs(score1 - score2) < 10 ? true : false;

    // random winner and looser
    let win = teams[options];
    let los;
    for (let i in teams) {
        if (teams[options] != teams[i]) los = teams[i]
    }

    return {
        winner: {
            team: win,
            score: score1 > score2 ? score1 : score2 > score1 ? score2 : null
        },
        looser: {
            team: los,
            score: score1 < score2 ? score1 : score2 < score1 ? score2 : null
        },
        overtime: overtime
    }
}



module.exports = { randomScore, simulateGame }