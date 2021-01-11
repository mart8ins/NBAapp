const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const gameSchema = new Schema({
    winner: {
        team: {
            type: String,
            text: true,
            required: true
        },
        score: {
            type: Number,
            required: true
        }
    },
    looser: {
        team: {
            type: String,
            text: true,
            required: true
        },
        score: {
            type: Number,
            required: true
        }
    },
    homeTeam: {
        type: String,
        required: true
    },
    gameDate: {
        type: Date,
        required: true
    },
    overtime: {
        type: Boolean
    }
})

module.exports = mongoose.model("Game", gameSchema);