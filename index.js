const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utils/catchAsync");
const AppErrors = require("./utils/AppErrors");

const app = express();

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.engine("ejs", ejsMate);

mongoose.connect("mongodb://localhost:27017/nbaStats", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind("error occured: "));
db.once("open", () => {
    console.log("Connection to database successful!");
});

const Team = require("./models/team");
const Game = require("./models/game");




app.get("/", catchAsync(async (req, res) => {
    const teams = await Team.find({});
    if (!teams) throw new AppErrors(404, "There is no teams to show")
    res.render("index", { teams })
}))

app.get("/team/:id", catchAsync(async (req, res) => {
    const teamQuery = req.query.team;
    const team = await Team.findById(req.params.id);
    if (!team) throw new AppErrors(404, "There is no data about team");
    const winnedGames = await Game.find({ "winner.team": teamQuery });
    const lostGames = await Game.find({ "looser.team": teamQuery });
    res.render("teams/team", { team, winnedGames, lostGames })
}))

app.get("/games/new", catchAsync(async (req, res) => {
    const teams = await Team.find({});
    if (!teams) throw new AppErrors(404, "There is no team data to create new games!");
    res.render("games/new", { teams });
}))

app.get("/games", catchAsync(async (req, res) => {
    const games = await Game.find({});
    if (!games) throw new AppErrors(404, "There is no played games to show!")
    res.render("games/games", { games });
}))

app.post("/games", catchAsync(async (req, res) => {
    const newGame = req.body;
    if (!newGame) throw new AppErrors(404, "Missing data about new game!")
    const game = await new Game({
        winner: {
            "team": newGame.winner,
            "score": newGame.winnerScore
        },
        looser: {
            "team": newGame.looser,
            "score": newGame.looserScore
        },
        homeTeam: newGame.teamHome,
        gameDate: newGame.gameDay,
        overtime: newGame.overtime ? newGame.overtime : false,
    })
    game.save();
    res.redirect("/games");
}))

app.get("/games/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const game = await Game.findById(id);
    if (!game) throw new AppErrors(404, "There is no data about this game");
    res.render("games/gameDetails", { game });
}))


app.all("*", (req, res, next) => {
    next(new AppErrors(404, "Page not found"));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something went wrong";
    res.status(statusCode).render("error", { err })
})



app.listen(3000, () => {
    console.log("App started on port 3000")
})