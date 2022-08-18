const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const {startOfDay , endOfDay} = require("date-fns")
//const { resolve } = require('path');

const WordHistorySchema = new Schema({

    english : String,
    italian : String,
    french : String,
    portuguese : String,
    hungarian : String,
    polish : String,
    german : String,
    swedish : String,
    irish : String,
    esperanto : String,
    azerbaijani : String,
    order : [{
        language : String , 
        value : String
    }],

    dateUsed : {
        type : Date,
        default : new Date() 
    }
});

/**
 * Get Word used in todays game
 * @returns Promisse
 */
WordHistorySchema.statics.getTodaysWord = function(){
  
    return new Promise(function(resolve, reject){
      
      WordHistory.findOne({
        dateUsed : {
          $gte: startOfDay(new Date()),
          $lte: endOfDay(new Date())
        }
      }).exec(function(err, result) {
        resolve(result) ;
      });
    });
  
    
  
  }

const WordHistory  = mongoose.model('WordHistory',WordHistorySchema);

module.exports = WordHistory;