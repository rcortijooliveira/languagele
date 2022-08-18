module.exports = async (req, res) => {

    const WordHistory = require('../models/WordHistory');

    let id = req.query.id
    WordHistory.getTodaysWord().then(function (todays_word) {
      res.send(todays_word.order[id])
    });

}



