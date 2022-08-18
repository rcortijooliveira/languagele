const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ArrayHelpers = require('../utils/ArrayHelpers')

const WordSchema = new Schema({

    english: String,
    italian: String,
    french: String,
    portuguese: String,
    hungarian: String,
    polish: String,
    german: String,
    swedish: String,
    irish: String,
    esperanto: String,
    azerbaijani: String,

    dateAdded: {
        type: Date,
        default: new Date()
    }
});

/**
 * Returns a random word chosen from all available words
 * 
 * @returns Promise
 */
 WordSchema.statics.getRandomWord = function () {


    return new Promise(function (resolve, reject) {

        Word.count().exec(function (err, count) {

            if (err) {
                return;

            }

            var random = Math.floor(Math.random() * count);
            Word.findOne().skip(random).exec(
                function (err, result) {

                    resolve(result);

                });
        });
    });

}

/**
 * Prepare a word for presentation removing not presented attributes
 * @param {Word} word 
 * @returns 
 */
 WordSchema.statics.wordPreparations = function (word) {

    var fields = new Map(Object.entries(word._doc));
    fields.delete('_id');
    fields.delete('__v');
    fields.delete('dateAdded');
    fields.delete('dateUsed');
    fields.delete('order');
    let word_array = Array.from(fields, ([language, value]) => ({ language, value }));
    let english_solution = word_array.shift();
    word_array = ArrayHelpers.shuffle(word_array);
    return { word_array, english_solution }

}


/**
 * Load an word example entry to db
 */
WordSchema.statics.loadFirstEntry = async function () {

    const word = await Word.create({
        english: 'dog',
        italian: 'cane',
        french: 'chien',
        portuguese: 'cão',
        hungarian: 'kutya',
        polish: 'pies',
        german: 'hund',
        swedish: 'hund',
        irish: 'madra',
        esperanto: 'hundo',
        azerbaijani: 'it'
    });
}




const Word = mongoose.model('Word', WordSchema);

module.exports = Word;