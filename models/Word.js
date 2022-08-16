const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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