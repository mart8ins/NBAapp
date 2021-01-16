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
function simulateGame(gameStatsTeam1, gameStatsTeam2, gameDay) {

    // arrays with teams title and its rating
    let team1 = gameStatsTeam1;
    let team2 = gameStatsTeam2;

    // each teams total game score depending of players points
    // team 1
    let totalScoreTeam1 = 0;
    team1.playerStats.forEach((player => {
        totalScoreTeam1 += player.stats.pts;
    }))
    // team 2
    let totalScoreTeam2 = 0;
    team2.playerStats.forEach((player => {
        totalScoreTeam2 += player.stats.pts;
    }))

    // logic for simulating possible overtime for game
    function isOvertime(totalScoreTeam1, totalScoreTeam2) {
        let isOvertime = false;
        let randomForDetermineOvertime = Math.floor(Math.random() * 2); // 0 - 3 for random possibility
        console.log(randomForDetermineOvertime)
        let scoreDiff = 12;
        let diff;

        if (totalScoreTeam1 > totalScoreTeam2) {
            diff = totalScoreTeam1 - totalScoreTeam2;
            if ((diff < scoreDiff) && randomForDetermineOvertime == 0) {
                isOvertime = true;
            }
        } else if (totalScoreTeam1 < totalScoreTeam2) {
            diff = totalScoreTeam2 - totalScoreTeam1;
            if ((diff < scoreDiff) && randomForDetermineOvertime == 0) {
                isOvertime = true;
            }
        }
        return isOvertime;
    }


    return {
        winner: {
            team: totalScoreTeam1 > totalScoreTeam2 ? team1.team : team2.team,
            score: totalScoreTeam1 > totalScoreTeam2 ? totalScoreTeam1 : totalScoreTeam2,
            stats: totalScoreTeam1 > totalScoreTeam2 ? team1.playerStats : team2.playerStats
        },
        looser: {
            team: totalScoreTeam1 < totalScoreTeam2 ? team1.team : team2.team,
            score: totalScoreTeam1 < totalScoreTeam2 ? totalScoreTeam1 : totalScoreTeam2,
            stats: totalScoreTeam1 < totalScoreTeam2 ? team1.playerStats : team2.playerStats
        },
        overtime: isOvertime(totalScoreTeam1, totalScoreTeam2),
        homeTeam: "Something",
        gameDate: gameDay
    }

}

function simulateStats(teamRooster) {

    let rooster = teamRooster; // array ar objektiem
    let statsArr = [];

    rooster.forEach((player) => {
        // initialy is teams score, which decreases when looping throug rooster, at the end should be zero

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
    })
    return statsArr;
}



// {
//     team: 'Celtics',
//     playerStats: [
//       {
//         name: 'Jaylen Brown',
//         position: 'shooting guard',
//         stats: [Object]
//       },
//       { name: 'Javonte Green', position: 'center', stats: [Object] },
//       { name: 'Jayson Tatum', position: 'point guard', stats: [Object] },
//       { name: 'Ennes Kanter', position: 'center', stats: [Object] },
//       {
//         name: 'Grant Williams',
//         position: 'power forward',
//         stats: [Object]
//       }
//     ]
//   }


module.exports = { randomScore, simulateGame, simulateStats }