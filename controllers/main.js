module.exports = async (req, res) => {

    const Game = require('../models/Game');

    Game.prepareGame().then(function (result) {
        
        let words_length = result.words_length;
        let english_solution_length = result.english_solution_length;

        res.render('index', {
            words_length, english_solution_length
        });
    });

}
