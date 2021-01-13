// random score for simulating game
function randomScore(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function simulateGame(newGame) {
    let score1 = randomScore(70, 130);
    let score2 = randomScore(70, 130);
    return {
        winner: {
            team: newGame.team1,
            score: score1 > score2 ? score1 : score2 > score1 ? score2 : null
        },
        looser: {
            team: newGame.team2,
            score: score1 < score2 ? score1 : score2 < score1 ? score2 : null
        }
    }
}



module.exports = { randomScore, simulateGame }


// {
//     team1: 'Hawks',
//     team2: 'Celtics',
//     teamHome: 'Celtics',
//     overtime: 'true',
//     gameDay: '2021-01-14'
//   }