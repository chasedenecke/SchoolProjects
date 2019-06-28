const express = require('express');
const multer = require('multer');
const path = require('path');
const bodyParser  = require('body-parser');
const morgan = require('morgan');
const crypto = require('crypto');
const dateTime = require('node-datetime');
const MongoClient = require('mongodb').MongoClient;
const spawn = require("child_process").spawn;
const port = process.env.PORT || 3000;
var dt = dateTime.create();

var db = null;

var fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));


const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/uploads/')
  },
  filename: function (req, file, callback) {
    crypto.pseudoRandomBytes(16, function(err, raw) {
      if (err) return callback(err);
    
      callback(null, raw.toString('hex') + path.extname(file.originalname));
    });
  }
});

var upload = multer({storage: storage});

var url = "mongodb://localhost:27017";

MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
  if (err) throw err;
  console.log("Database created!");
  db = client.db('radb');
  db.collection('Submissions', function (err, collection) {
    collection.find({}).toArray(function(err, result) {
      if (err) throw err;
      //console.log(result);
    });
  });
  app.listen(port, () => console.log(`Listening on port ${port}`));
});


app.get('/submissions/photo/:photoURI', (req, res) => {
  fs.readFile('./public/uploads/'+req.params.photoURI, function (err, content) {
    if (err) {
        res.writeHead(400, {'Content-type':'text/html'});
        res.end("No such image");    
    } else {
        //specify the content type in the response will be an image
        res.writeHead(200,{'Content-type':'image/jpg'});
        res.end(content);
    }
  });
});

app.post('/submissions', upload.single('photo'), (req, res) => {
  if (!req.file) {
    console.log("No file received");
    return res.send({
      success: false
    });

  } else {
    console.log('file received');
    //console.log('userID: ' + req.body.userID + ' jointData ' + req.body.jointData + ' filename: ' + req.file.filename);
    addSubmission(req.body.userID, req.body.jointData, req.file.filename);
    const SegIP = "localhost";
    const SegPort = 8485;
    child = spawn('python3',["./SegClient.py", SegIP, SegPort, req.file.filename, "SEGMENTED_"+req.file.filename]);
    child.stdout.on('data', function(data) { 
      if(data.toString() == "1"){
        updateSubmission();
      } 
    });
    return res.send({
      success: true
    })
  }
});

app.get('/submissions/:userID', (req, res) => {
  console.log("userID: " + req.params.userID);
  db.collection('Submissions', function (err, collection) {
    if (err) throw err;
    collection.find({userID: req.params.userID}).toArray(function(err, result) {
      if (err) throw err;
      res.send(
        {
          "submissions": result
        }
      );
    });
  });
});

app.use('*', (req, res, next) => {
  console.log("The path " + req.originalUrl + " doesn't exist");
  res.status(404).send({
    err: "The path " + req.originalUrl + " doesn't exist"
  });
});

addSubmission(userID, jointData, photoURI) = () => {
  if(db == null){
    return;
  }
  db.collection('Submissions', function (err, collection) {
    if (err) throw err;
    db.collection('Submissions').countDocuments(function (err, count) {
      if (err) throw err;
      collection.insertOne({ id: count, userID: userID,date: dt.format('Y-m-d H:M:S'), status: "Processing", jointData: jointData, photoURI: photoURI });
    });
  });
}

updateSubmission = () => {

}