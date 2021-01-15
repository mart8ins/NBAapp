/*****************************
random score for simulating game
*****************************/
function randomScore(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function randomStats(position, stat, playerRating) {
    // depending on rating it will determin players max possible points
    const rating90_100 = 40;
    const rating80_90 = 30;
    const rating70_80 = 22;
    const rating70 = 15;

    if (stat == "pts") {
        if (playerRating >= 90) return randomScore(10, rating90_100);

        if (playerRating >= 80 && playerRating < 90) return randomScore(10, rating80_90);

        if (playerRating >= 70 && playerRating < 80) return randomScore(10, rating70_80);

        if (playerRating < 70) return randomScore(6, rating70);

    } else {
        if (position == "shooting guard" && stat == "reb") return randomScore(0, 5);
        if (position == "shooting guard" && stat == "ast") return randomScore(0, 7);
        if (position == "shooting guard" && stat == "blk") return randomScore(0, 3);
        if (position == "shooting guard" && stat == "stl") return randomScore(0, 2);

        if (position == "center" && stat == "reb") return randomScore(0, 18);
        if (position == "center" && stat == "ast") return randomScore(0, 5);
        if (position == "center" && stat == "blk") return randomScore(0, 7);
        if (position == "center" && stat == "stl") return randomScore(0, 2);

        if (position == "point guard" && stat == "reb") return randomScore(0, 8);
        if (position == "point guard" && stat == "ast") return randomScore(0, 14);
        if (position == "point guard" && stat == "blk") return randomScore(0, 1);
        if (position == "point guard" && stat == "stl") return randomScore(0, 6);

        if (position == "power forward" && stat == "reb") return randomScore(0, 10);
        if (position == "power forward" && stat == "ast") return randomScore(0, 4);
        if (position == "power forward" && stat == "blk") return randomScore(0, 4);
        if (position == "power forward" && stat == "stl") return randomScore(0, 1);

        if (position == "small forward" && stat == "reb") return randomScore(0, 7);
        if (position == "small forward" && stat == "ast") return randomScore(0, 5);
        if (position == "small forward" && stat == "blk") return randomScore(0, 3);
        if (position == "small forward" && stat == "stl") return randomScore(0, 3);
    }
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

function simulateStats(teamScore, teamRooster) {
    let score = teamScore; // spēles kopējais punktu skaitlis

    let rooster = teamRooster; // array ar objektiem
    let statsArr = [];

    rooster.forEach((player) => {
        // initialy is teams score, which decreases when looping throug rooster, at the end should be zero
        let remainingScore = score;

        // looping through teams rooster and creating players stats object what is pushed in array -  statsArr
        statsArr.push({
            name: player.name,
            position: player.position,
            stats: {
                pts: randomStats(player.position, "pts", player.rating), // šo jāatrisina
                reb: randomStats(player.position, "reb"),
                ast: randomStats(player.position, "ast"),
                blk: randomStats(player.position, "blk"),
                stl: randomStats(player.position, "stl")
            }
        })
        // keeping track of remaining teams score minus players points
        statsArr.forEach((playerStats) => {
            remainingScore = remainingScore - playerStats.stats.pts
        })
        console.log(remainingScore)
    })
    console.log(statsArr)

    // return statsArr;
}



/*
88 [
  {
    stats: { pts: 17.3, reb: 2.1, ast: 3.4, blk: 1.4, stl: 2.7 },
    _id: 5fff470248104e3d04dd5a9d,
    name: 'Kevin Huerter',
    age: 19,
    jersey: 12,
    position: 'shooting guard',
    rating: 76
  },
  {
    stats: { pts: 17.8, reb: 10.2, ast: 4.7, blk: 2.1, stl: 1.5 },
    _id: 5fff470248104e3d04dd5a9e,
    name: 'Danilo Gallinari',
    age: 32,
    jersey: 8,
    position: 'center',
    rating: 81
  },
  {
    stats: { pts: 29.4, reb: 6.7, ast: 9.4, blk: 0.5, stl: 4.6 },
    _id: 5fff470248104e3d04dd5a9f,
    name: 'Trae Yang',
    age: 21,
    jersey: 11,
    position: 'point guard',
    rating: 88
  },
  {
    stats: { pts: 15.8, reb: 4.6, ast: 1.3, blk: 4.1, stl: 1.8 },
    _id: 5fff470248104e3d04dd5aa0,
    name: 'Solomon Hill',
    age: 33,
    jersey: 56,
    position: 'center',
    rating: 72
  },
  {
    stats: { pts: 21.1, reb: 8.5, ast: 2.4, blk: 3.3, stl: 1.1 },
    _id: 5fff470248104e3d04dd5aa1,
    name: 'John Collins',
    age: 25,
    jersey: 32,
    position: 'power forward',
    rating: 83
  }
]
*/


module.exports = { randomScore, simulateGame, simulateStats }