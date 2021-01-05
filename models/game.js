const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const gameSchema = new Schema({
    winner: {
        team: String,
        score: Number
    },
    looser: {
        team: String,
        score: Number
    },
    homeTeam: String,
    gameDate: Date,
    overtime: Boolean
})

module.exports = mongoose.model("Game", gameSchema);