const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const teamSchema = new Schema({
    teamName: String,
    teamCity: String,
    teamLogo: String,
    rooster: [{
        type: Schema.Types.ObjectId, ref: "Player"
    }]

})


module.exports = mongoose.model("Team", teamSchema);