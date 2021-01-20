const express = require("express");
const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const AppErrors = require("../utils/AppErrors");

const Team = require("../models/team");
const Game = require("../models/game");

const { simulateGame, simulateStats, playerCareerAvarages } = require("../utils/functions");


router.get("/", catchAsync(async (req, res) => {
    const games = await Game.find({});
    if (!games) throw new AppErrors(404, "There is no played games to show!")
    res.render("games/games", { games });
}))

router.post("/", catchAsync(async (req, res) => {
    // getting game teams names, game date, home court team , gameDay
    const newGame = req.body;
    if (!newGame) throw new AppErrors(404, "Missing data about simulated game!");

    // team data
    let team1 = await Team.findOne({ teamName: newGame.team1 }).populate("rooster");
    let team2 = await Team.findOne({ teamName: newGame.team2 }).populate("rooster");

    // // simulate stats for both teams, objects with teams name, and player game stats array
    let gameStatsTeam1 = {
        team: team1.teamName,
        playerStats: simulateStats(team1.rooster)
    }
    let gameStatsTeam2 = {
        team: team2.teamName,
        playerStats: simulateStats(team2.rooster)
    }

    // using both team game stats calculate winning team.
    const result = simulateGame(gameStatsTeam1, gameStatsTeam2, newGame.gameDay);

    // saving game, before need to get data to save ******************************
    const game = await new Game({
        winner: {
            team: result.winner.team,
            score: result.winner.score
            ,
            rooster: result.winner.stats
        },
        looser: {
            team: result.looser.team,
            score: result.looser.score
            ,
            rooster: result.looser.stats
        },
        homeTeam: result.homeTeam,
        gameDate: result.gameDate,
        overtime: result.overtime
    })
    await game.save();

    // find all existing games where current team lost or won
    const winnedGamesTeam1 = await Game.find({ "winner.team": team1.teamName }); // array with all winned games objects
    const lostGamesTeam1 = await Game.find({ "looser.team": team1.teamName }); // array with all lost games objects

    const winnedGamesTeam2 = await Game.find({ "winner.team": team2.teamName }); // array with all winned games objects
    const lostGamesTeam2 = await Game.find({ "looser.team": team2.teamName }); // array with all lost games objects

    /*
    update player career avarage stats !!!!!!!!! need to change, not in a right route
    update in database happens only when goes in this route, and not when game is played
    */
    playerCareerAvarages(winnedGamesTeam1, lostGamesTeam1, team1.teamName);
    playerCareerAvarages(winnedGamesTeam2, lostGamesTeam2, team2.teamName); // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    /* !!!!!!!!!!!!!!!!! *****************!!!!!!!!!!!!!!!!!!!!!!  */


    res.redirect("/games");
}))

router.get("/simulate", catchAsync(async (req, res) => {
    const teams = await Team.find({});
    if (!teams) throw new AppErrors(404, "There is no team data to simulate games!");
    res.render("games/simulate", { teams });
}))

router.get("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const game = await Game.findById(id);
    if (!game) throw new AppErrors(404, "There is no data about this game");
    res.render("games/gameDetails", { game });
}))

module.exports = router;