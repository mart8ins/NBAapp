const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const teamSchema = new Schema({
    teamName: String,
    teamCity: String,
    teamLogo: String,
    rating: Number,
    rooster: [
        {
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
            }
        }
    ]
})


module.exports = mongoose.model("Team", teamSchema);