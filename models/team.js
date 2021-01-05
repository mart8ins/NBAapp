const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const teamSchema = new Schema({
    teamName: String,
    teamCity: String,
    teamLogo: String
})


module.exports = mongoose.model("Team", teamSchema);