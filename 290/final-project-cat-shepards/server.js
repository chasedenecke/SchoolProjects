var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb');
var Handlebars = require('handlebars');
var app = express();
var port = process.env.PORT || 3000;

var mongoHost = process.env.MONGO_HOST || "ds143151.mlab.com";
var mongoPort = process.env.MONGO_PORT || 43151;
var mongoUser = process.env.MONGO_USER || "cs290_janzeng";
var mongoPassword = process.env.MONGO_PASSWORD || "y0ushallnotpass";
var mongoDBName = process.env.MONGO_DB || "heroku_bp42bgrj";
var mongoURL = 'mongodb://' + mongoUser + ':' + mongoPassword +
  '@' + mongoHost + ':' + mongoPort + '/' + mongoDBName;
var mongoDB;

console.log('== MongoDB URL:', mongoURL);


app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function(req, res, next){
  var collection = mongoDB.collection('cats');
  collection.find({}).toArray(function (err, catData){
    if (err) {
      res.status(500).send("Error fetching cats from db.");
    } else {
      var templateArgs = {
        cat: catData
      };
      res.render('catPage', templateArgs);
    }
  });
});


app.get('/pawpular', function(req, res, next){
  function sort(data){
    var swapped = true;
    var i = 0;
    var temp;
    while(swapped){
      swapped = false;
      i++;
      for(var j = 0; j<data.length-i; j++){
        if(data[j].votes < data[j+1].votes){
          temp = data[j];
          data[j] = data[j+1];
          data[j+1] = temp;
          swapped = true;
        }
      }
    }
  };

  var collection = mongoDB.collection('cats');
  collection.find({}).toArray(function(err, catData){
    if(err){
      res.status(500).send("Error fetching cats from db.");
    }

    else{
      var newCatData = catData;
      sort(newCatData);
      Handlebars.registerHelper('cat', function(from, to, context, options){
        var item = "";
        for(var i = from, j = to; i<j; i++){
          item = item + options.fn(context[i]);
        }
        return item;
      });

      var templateArgs = {
        cat: catData
      };
      res.render('pawpularPage', templateArgs);
    }
  });
});



app.post('/upvote',function(req, res, next) {

  var dataID = req.body.dataID;
  var collection = mongoDB.collection('cats');
  var id = new MongoClient.ObjectID(dataID);
  collection.findOneAndUpdate(
    { _id: id},
    { $inc: { votes: 1} },
    { projection: { "votes" : 1, "_id": 0 } },
    function(err, result){
      if (err) {
        console.log("Error fetching cat from database.")
        res.status(500).send("fail");
      }
      else {
        var newVote = result.value;
        res.status(200).send(newVote);
      }
    }
  );
});



app.post("/newCat", function(req, res, next) {
  var collection = mongoDB.collection('cats');
  collection.insert(req.body);
  res.status(200).send();

});


app.get('*', function(req, res, next){
  res.status(404).render('404Page');
});


MongoClient.connect(mongoURL, function (err, db) {
  if (err) {
    throw err;
  }
  mongoDB = db;
  app.listen(port, function () {
    console.log("== Server listening on port", port);
  });
});
