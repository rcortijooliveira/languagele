const { default: mongoose } = require('mongoose');
const Word = require('./models/Word');

mongoose.connect('mongodb://localhost:27017/Languagele' ,
{
  useNewUrlParser: true,
  useUnifiedTopology: true
}
);


const seed_data = [

    {
      english:     "buyer",
      italian:     "acquirente",
      french:      "acheteur",
      portuguese:  "comprador",
      hungarian:   "vevő",
      polish:      "nabywcy",
      german:      "käufer",
      swedish:     "köpare",
      irish:       "ceannaitheoirí",
      esperanto:   "aĉetantoj",
      azerbaijani: "alıcı",
    },
    {
      english:     "charity",
      italian:     "carità",
      french:      "charité",
      portuguese:  "caridade",
      hungarian:   "jótékonysági",
      polish:      "fundacja",
      german:      "liebe",
      swedish:     "välgörenhet",
      irish:       "carthanacht",
      esperanto:   "karitato",
      azerbaijani: "xeyriyyə"
    },
    {
      english:    "mixture",
      italian:    "miscela",
      french:     "mélange",
      portuguese: "mistura",
      hungarian:  "keverék",
      polish:     "mixture",
      german:     "mischung",
      swedish:    "blandning",
      irish:      "meascán",
      esperanto:   "miksaĵo",
      azerbaijani: "qarışıq"
    },
    {
      english:     "finding",
      italian:     "trovare",
      french:      "découverte",
      portuguese:  "encontrar",
      hungarian:   "megtalálni",
      polish:      "znalezienie",
      german:      "finden",
      swedish:     "fynd",
      irish:       "aimsiú",
      esperanto:   "trovado",
      azerbaijani: "axtarış"
    },
    {
      english:     "failure",
      italian:     "guasto",
      french:      "défaillance",
      portuguese:  "falha",
      hungarian:   "kudarc",
      polish:      "awaria",
      german:      "fehler",
      swedish:     "misslyckande",
      irish:       "teip",
      esperanto:   "fiasko",
      azerbaijani: "qrup"
    }

]


async function  seedDB(){

    await  Word.deleteMany({});
    await  Word.insertMany(seed_data);

}

seedDB().then(function(){

    mongoose.connection.close();
})