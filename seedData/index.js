const mongoose = require("mongoose");
const { teams } = require("./teams");
const { players } = require("./players");
const Team = require("../models/team");
const Player = require("../models/player");
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

// PLAYER SEED
// const seedDB = async () => {
//     await Player.deleteMany({});

//     let playerData;

//     for (let i = 0; i < players.length; i++) {
//         playerData = new Player({
//             name: players[i].name,
//             age: players[i].age,
//             jersey: players[i].jersey,
//             position: players[i].position,
//             rating: players[i].rating,
//             stats: {
//                 pts: players[i].stats.pts,
//                 reb: players[i].stats.reb,
//                 ast: players[i].stats.ast,
//                 blk: players[i].stats.blk,
//                 stl: players[i].stats.stl
//             },
//             currentTeam: players[i].currentTeam,
//             team: await Team.findOne({ teamName: players[i].currentTeam })
//         })
//         await playerData.save();
//     }
// }


// TEAM SEED
// const seedDB = async () => {
//     await Team.deleteMany({});
//     let team = "";
//     for (let i = 0; i < teams.length; i++) {
//         team = new Team({
//             teamName: `${teams[i].name}`,
//             teamCity: `${teams[i].city}`,
//             teamLogo: `${teams[i].logo}`,
//             rooster: await Player.find({ currentTeam: teams[i].name })
//         })
//         await team.save();
//     }
// }

/* VECAAA VERSIJA TEAMS!!!!!!!!!!! */
// seed data for Team
// const seedDB = async () => {
//     await Team.deleteMany({});
//     let team = "";

//     for (let i = 0; i < teams.length; i++) {
//         let rooster = [];
//         team = new Team({
//             teamName: `${teams[i].name}`,
//             teamCity: `${teams[i].city}`,
//             teamLogo: `${teams[i].logo}`
//         })
//         for (let j = 0; j < teams[i].rooster.length; j++) {
//             rooster.push(
//                 {
//                     name: teams[i].rooster[j].name,
//                     age: teams[i].rooster[j].age,
//                     jersey: teams[i].rooster[j].jersey,
//                     position: teams[i].rooster[j].position,
//                     rating: teams[i].rooster[j].rating,
//                     stats: {
//                         pts: teams[i].rooster[j].stats.pts,
//                         reb: teams[i].rooster[j].stats.reb,
//                         ast: teams[i].rooster[j].stats.ast,
//                         blk: teams[i].rooster[j].stats.blk,
//                         stl: teams[i].rooster[j].stats.stl
//                     }
//                 }
//             )
//         }
//         team.rooster = rooster;
//         await team.save();
//     }
// }

// GAME SEED
const seedDB = async () => {
    await Game.deleteMany({});
    // for (let i = 0; i < games.length; i++) {
    //     const game = new Game({
    //         winner: {
    //             team: games[i].winner.team,
    //             score: games[i].winner.score
    //         },
    //         looser: {
    //             team: games[i].looser.team,
    //             score: games[i].looser.score
    //         },
    //         homeTeam: games[i].homeTeam,
    //         gameDate: games[i].gameDate,
    //         overtime: games[i].overtime
    //     })
    //     await game.save();
    // }
}



seedDB().then(() => {
    console.log("Database closed for seed operations")
    mongoose.connection.close();
})