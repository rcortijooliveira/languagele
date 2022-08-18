const Word = require('../models/Word');
const WordHistory = require('../models/WordHistory');
const { startOfDay } = require("date-fns");


class Game {

    /**
     * Setup Game Data for presentation on Client Side
     * @returns number of translations available and length of solution
     */
    static prepareGame() {
        return new Promise(function (resolve, reject) {

            let result = null;

            WordHistory.getTodaysWord().then(function (todays_word) {
                if (todays_word == null) {

                    Word.getRandomWord().then(
                        function (word) {

                            result = Game.prepareTodaysGameData(word);
                            resolve(result);

                        });

                } else {

                    result = Game.retrieveTodaysGameData(todays_word);
                    resolve(result);
                }

            });

        })
    }

    /**
     * Prepare Game Data for todays game
     * @param {Word} word 
     * @returns 
     */
    static prepareTodaysGameData(word) {

        let word_data = Word.wordPreparations(word);
        let today = startOfDay(new Date());
        var todays_new_word = new WordHistory({

            english: word.english,
            italian: word.italian,
            french: word.french,
            portuguese: word.portuguese,
            hungarian: word.hungarian,
            polish: word.polish,
            german: word.german,
            swedish: word.swedish,
            irish: word.irish,
            esperanto: word.esperanto,
            azerbaijani: word.azerbaijani,
            order: word_data.word_array,
            dateAdded: today
        })

        todays_new_word.save(function (err, result) {
            if (err) {
                console.log(err);
            }
        })

        let words_length = word_data.word_array.length;
        let english_solution_length = word_data.english_solution.value.length;
        return { words_length: words_length, english_solution_length: english_solution_length };

    }

    /**
     * Retrieve game data for todays game
     * @param {Word} todays_word 
     * @returns 
     */
    static retrieveTodaysGameData(todays_word) {

        let word_data = Word.wordPreparations(todays_word);
        let words_length = word_data.word_array.length;
        let english_solution_length = word_data.english_solution.value.length;
        return { words_length: words_length, english_solution_length: english_solution_length };
    }


}

module.exports = Game;