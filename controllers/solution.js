module.exports = async (req, res) => {

    const WordHistory = require('../models/WordHistory');
    WordHistory.getTodaysWord().then(function (todays_word) {

        let result = req.query.solution == todays_word.english;
        let solution = false;
    
        if(result){
          solution = todays_word.english;
        }
    
        let response = {
          result : result,
          solution: solution
        }
        res.send(response)
      });
    
}