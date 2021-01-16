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

const { simulateGame, simulateStats } = require("./utils/functions");



app.get("/", (req, res) => {
    res.render("index")
})

app.get("/teams", catchAsync(async (req, res) => {
    const teams = await Team.find({});
    if (!teams) throw new AppErrors(404, "There is no teams to show")
    res.render("teams/teams", { teams })
}))

app.get("/teams/:id", catchAsync(async (req, res) => {
    const teamQuery = req.query.team;
    const team = await Team.findById(req.params.id);
    if (!team) throw new AppErrors(404, "There is no data about team");
    const winnedGames = await Game.find({ "winner.team": teamQuery });
    const lostGames = await Game.find({ "looser.team": teamQuery });
    res.render("teams/team", { team, winnedGames, lostGames })
}))


app.get("/games", catchAsync(async (req, res) => {
    const games = await Game.find({});
    if (!games) throw new AppErrors(404, "There is no played games to show!")
    res.render("games/games", { games });
}))

app.post("/games", catchAsync(async (req, res) => {
    // getting game teams names, game date, home court team , gameDay
    const newGame = req.body;
    if (!newGame) throw new AppErrors(404, "Missing data about simulated game!");


    // team data
    let team1 = await Team.findOne({ teamName: newGame.team1 });
    let team2 = await Team.findOne({ teamName: newGame.team2 });


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

    console.log(result)
    // saving game, before need to get data to save ******************************
    const game = await new Game({
        winner: {
            "team": result.winner.team,
            "score": result.winner.score,
            "rooster": result.winner.stats
        },
        looser: {
            "team": result.looser.team,
            "score": result.looser.score,
            "rooster": result.looser.stats
        },
        homeTeam: result.homeTeam,
        gameDate: result.gameDate,
        overtime: result.overtime
    })
    game.save();
    res.redirect("/games");

}))


app.get("/games/simulate", catchAsync(async (req, res) => {
    const teams = await Team.find({});
    if (!teams) throw new AppErrors(404, "There is no team data to simulate games!");
    res.render("games/simulate", { teams });
}))

app.get("/games/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const game = await Game.findById(id);
    if (!game) throw new AppErrors(404, "There is no data about this game");
    console.log(game.winner.rooster)
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