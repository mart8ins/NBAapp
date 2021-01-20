const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb://localhost:27017/nbaStats", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const Player = require("../models/player");


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

// logic for simulating possible overtime for game
function isOvertime(totalScoreTeam1, totalScoreTeam2) {
    let isOvertime = false;
    let randomForDetermineOvertime = Math.floor(Math.random() * 2); // 0 - 1 for random possibility
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

    // deside home team
    let desideHomeTeam = Math.floor(Math.random() * 2);

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
        homeTeam: desideHomeTeam == 0 ? team1.team : team2.team,
        gameDate: gameDay
    }
}

function simulateStats(teamRooster) {
    let rooster = teamRooster; // array ar objektiem
    let statsArr = [];

    // simulate stats for each player
    rooster.forEach((player) => {
        let objStats = {
            name: player.name,
            position: player.position,
            stats: {
                pts: randomStats(player.position, "pts", player.rating), // šo jāatrisina
                reb: randomStats(player.position, "reb"),
                ast: randomStats(player.position, "ast"),
                blk: randomStats(player.position, "blk"),
                stl: randomStats(player.position, "stl")
            }
        }
        // looping through teams rooster and creating players stats object what is pushed in array -  statsArr
        statsArr.push(objStats)
    })
    return statsArr;
}

// accepts to arrays with objects
async function playerCareerAvarages(wins, loses, teamName) {

    let team = teamName;
    let winnedGames = wins;
    let lostGames = loses;

    let allGamesForNeededTeam = []; // all games for needed team, nested arrays in array. nested array is with 5 objects (players)
    let playerNames = []; // all unique player name in allGamesForNeededTeam games
    let stats = []; // all objects with player stats from all games, array with objects, array full of objects, populated from allGamesForNeededTeam


    // for needed team, into allGamesForNeededTeam pushes arrays with objects from every game
    if (winnedGames.length > 0) {
        winnedGames.forEach((game) => {
            if (game.winner.team == team) {
                allGamesForNeededTeam.push(game.winner.rooster)
            }
        })
    }
    if (lostGames.length > 0) {
        lostGames.forEach((game) => {
            if (game.looser.team == team) {
                allGamesForNeededTeam.push(game.looser.rooster)
            }
        })
    }

    // filtering unique player name from all games avaliable, looses and wins, also populate allGamesForNeededTeam into stats array
    allGamesForNeededTeam.forEach((game) => { // game ir arrays ar 5 speletaju objektiem
        let gameData = game;
        gameData.forEach((g) => { // g ir objekts ar spēlētāja vārdu, statiem utt
            stats.push(g);
            if (playerNames.indexOf(g.name) == -1) {
                playerNames.push(g.name);
            }
        })
    })

    // loping through player name array and inside loop through all games array and creating new object with data
    for (let playerName of playerNames) {
        let playerUpdate = {
            gameCount: 0,
            stats: {
                pts: 0,
                reb: 0,
                ast: 0,
                blk: 0,
                stl: 0
            },
            name: "",
        }
        for (let game of stats) {
            if (playerName == game.name) {
                playerUpdate.gameCount++;
                playerUpdate.name = game.name;
                playerUpdate.stats.pts += game.stats.pts;
                playerUpdate.stats.reb += game.stats.reb;
                playerUpdate.stats.ast += game.stats.ast;
                playerUpdate.stats.blk += game.stats.blk;
                playerUpdate.stats.stl += game.stats.stl;
            }
        }
        // update players avarage stats in database
        await Player.findOneAndUpdate({ name: playerName }, {
            stats: {
                pts: playerUpdate.stats.pts / playerUpdate.gameCount,
                reb: playerUpdate.stats.reb / playerUpdate.gameCount,
                ast: playerUpdate.stats.ast / playerUpdate.gameCount,
                blk: playerUpdate.stats.blk / playerUpdate.gameCount,
                stl: playerUpdate.stats.stl / playerUpdate.gameCount
            }
        });
    }
}


module.exports = { randomScore, simulateGame, simulateStats, playerCareerAvarages }