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




app.get("/", async (req, res) => {
    const teams = await Team.find({});
    res.render("index", { teams })
})

app.get("/team/:id", async (req, res) => {
    const team = await Team.findById(req.params.id);
    res.render("teams/teamShow", { team })
})

app.get("/games", (req, res) => {
    res.render("games/games")
})

app.listen(3000, () => {
    console.log("App started on port 3000")
})