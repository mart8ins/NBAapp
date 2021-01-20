const express = require("express");
const router = express.Router();

const catchAsync = require("../utils/catchAsync");
const AppErrors = require("../utils/AppErrors");

const Team = require("../models/team");
const Game = require("../models/game");


router.get("/", catchAsync(async (req, res) => {
    const teams = await Team.find({});
    if (!teams) throw new AppErrors(404, "There is no teams to show")
    res.render("teams/teams", { teams })
}))

router.get("/:id", catchAsync(async (req, res) => {
    const teamQuery = req.query.team;
    const team = await Team.findById(req.params.id).populate("rooster");
    if (!team) throw new AppErrors(404, "There is no data about team");

    // find all existing games where current team lost or won
    const winnedGames = await Game.find({ "winner.team": teamQuery }); // array with all winned games objects
    const lostGames = await Game.find({ "looser.team": teamQuery }); // array with all lost games objects

    if (!winnedGames || !lostGames) throw new AppErrors(404, "There is missing data for games");
    res.render("teams/team", { team, winnedGames, lostGames })
}))

module.exports = router;