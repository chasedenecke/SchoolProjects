const router = require('express').Router();
const validation = require('../lib/validation');
const dateTime = require('node-datetime');
const spawn = require('child_process').spawn;
const upload = require('../lib/photo').upload;
var dt = dateTime.create();
var fs = require('fs');

const { getDBReference } = require('../mongodb/mongo');

const ObjectId = require('mongodb').ObjectID;

exports.router = router;

/*
 * Schema describing required/optional fields of a business object.
 */
const submissionSchema = {
	userid: {required: true},
	jointData: {required: true}
};

/*
 * Route to return a list of businesses.
 */
router.get('/', async function (req, res) {
	res.status(200).send({
		success: true
	});
});

//need to add db calls
router.get('/user/:userid', async function (req, res) {
	//let userid = ObjectId(req.params.userid);
	let userid = req.params.userid;
	let collection = getDBReference().collection('Submissions');
	collection.find({userid: userid}).sort({"_id":-1}).toArray(function(err, result) {
		if (err) reject();
		res.send({
			"submissions": result
		});
	});

});

//need to add async call to interact with ml network
//add multer include
router.post('/', upload.single('photo'), (req, res) => {
	if (!req.file) {
		res.status(400).send({
			error: "Request has no photo"
		});
	} else {
		if (validation.validateAgainstSchema(req.body, submissionSchema)) {
			let submission = validation.extractValidFields(req.body, submissionSchema);
			//submission.userid = ObjectId(submission.userid);
			submission.date = dt.format('m-d-Y H:M:S');
			submission.processed = false;
			submission.photoUri = req.file.filename;
			insertSubmission(submission);
			/*const SegIP = "localhost";
			const SegPort = 8485;
			child = spawn('python3',["./SegClient.py", SegIP, SegPort, req.file.filename, "SEGMENTED_"+req.file.filename]);
			child.stdout.on('data', function(data) { 
				if(data.toString() == "1"){
				updateSubmission();
				} 
			});*/
			res.status(204).send();
		} else {
			fs.unlinkSync('./public/uploads/'+req.file.filename);
			res.status(400).json({
				error: "Request body is not a valid review object"
			});
		}
	}
});

router.get('/photo/:photoUri', (req, res) => {
	let photoUri = req.params.photoUri;
	fs.readFile('./public/uploads/' + photoUri, (err, content) => {
		if (err) {		
			res.status(400).send();
		} else {
			res.writeHead(200,{'Content-type':'image/jpg'});
			res.end(content);
		}
	});
});

insertSubmission = async (submission) => {
	return new Promise(function(resolve, reject) {
		let collection = getDBReference().collection('Submissions');
		collection.insertOne(submission);
		resolve();
	});
}

getSubmissions = async () => {
	return new Promise(function(resolve, reject) {
		let collection = getDBReference().collection('Submissions');
		collection.find({userid: userid}).sort({"_id":1}).toArray(function(err, result) {
			if (err) reject();
			res.send({
				"submissions": result
			});
		});
	});
}

updateSubmission = () => {

}
