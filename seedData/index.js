const mongoose = require("mongoose");
const { teams } = require("./teams");
const Team = require("../models/team");
const { games } = require("./games");
const Game = require("../models/game")

mongoose.connect("mongodb://localhost:27017/nbaStats", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})


const seedDB = async () => {
    await Team.deleteMany({});
    let team = "";

    for (let i = 0; i < teams.length; i++) {
        let rooster = [];
        team = new Team({
            teamName: `${teams[i].name}`,
            teamCity: `${teams[i].city}`,
            teamLogo: `${teams[i].logo}`
        })
        for (let j = 0; j < teams[i].rooster.length; j++) {
            console.log(teams[i].rooster[j])
            rooster.push(
                {
                    name: teams[i].rooster[j].name,
                    age: teams[i].rooster[j].age,
                    jersey: teams[i].rooster[j].jersey,
                    position: teams[i].rooster[j].position,
                    rating: teams[i].rooster[j].rating,
                    stats: {
                        pts: teams[i].rooster[j].stats.pts,
                        reb: teams[i].rooster[j].stats.reb,
                        ast: teams[i].rooster[j].stats.ast,
                        blk: teams[i].rooster[j].stats.blk,
                        stl: teams[i].rooster[j].stats.stl
                    }
                }
            )
        }
        team.rooster = rooster;
        await team.save();
    }
}

// games
// const seedDB = async () => {
//     await Game.deleteMany({});
//     // for (let i = 0; i < games.length; i++) {
//     //     const game = new Game({
//     //         winner: {
//     //             team: games[i].winner.team,
//     //             score: games[i].winner.score
//     //         },
//     //         looser: {
//     //             team: games[i].looser.team,
//     //             score: games[i].looser.score
//     //         },
//     //         homeTeam: games[i].homeTeam,
//     //         gameDate: games[i].gameDate,
//     //         overtime: games[i].overtime
//     //     })
//     //     await game.save();
//     // }
// }

seedDB().then(() => {
    console.log("Database closed for seed operations")
    mongoose.connection.close();
})