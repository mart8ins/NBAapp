const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

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




app.get("/", async (req, res) => {
    const teams = await Team.find({});
    res.render("index", { teams })
})

app.get("/team/:id", async (req, res) => {
    const team = await Team.findById(req.params.id);
    res.render("teams/teamShow", { team })
})

app.get("/games/new", async (req, res) => {
    const teams = await Team.find({});
    res.render("games/new", { teams });
})

app.get("/games", async (req, res) => {
    const games = await Game.find({});
    res.render("games/games", { games });
})

app.post("/games", async (req, res) => {
    const newGame = req.body;
    const game = await new Game({
        winner: {
            team: newGame.winner,
            score: newGame.winnerScore
        },
        looser: {
            team: newGame.looser,
            score: newGame.looserScore
        },
        homeTeam: newGame.teamHome,
        gameDate: newGame.gameDay,
        overtime: newGame.overtime ? newGame.overtime : false,
    })
    game.save();
    res.redirect("/games");
})

app.get("/games/:id", async (req, res) => {
    const { id } = req.params;
    const game = await Game.findById(id);
    res.render("games/gameDetails", { game });
})


app.listen(3000, () => {
    console.log("App started on port 3000")
})