const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const playerSchema = new Schema({
    name: {
        type: String
    },
    age: {
        type: Number
    },
    jersey: {
        type: Number
    },
    position: {
        type: String
        // enum: ["point guard", "shooting guard", "small forward", "power forward", "center"]
    },
    rating: {
        type: Number
    },
    stats: {
        pts: {
            type: Number
        },
        reb: {
            type: Number
        },
        ast: {
            type: Number
        },
        blk: {
            type: Number
        },
        stl: {
            type: Number
        }
    },
    currentTeam: {
        type: String
    },
    team: { type: Schema.Types.ObjectId, ref: "Team" }
})


module.exports = mongoose.model("Player", playerSchema);