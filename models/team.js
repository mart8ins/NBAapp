const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const teamSchema = new Schema({
    teamName: String,
    teamCity: String,
    teamLogo: String,
    rooster:
        [{
            name: String,
            position: String,
            jerseyNumber: Number,
            about: String
        }]

})


module.exports = mongoose.model("Team", teamSchema);