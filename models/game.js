const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const gameSchema = new Schema({
    winner: {
        team: {
            type: String,
            text: true
        },
        score: Number
    },
    looser: {
        team: {
            type: String,
            text: true
        },
        score: Number
    },
    homeTeam: String,
    gameDate: Date,
    overtime: Boolean
})

module.exports = mongoose.model("Game", gameSchema);