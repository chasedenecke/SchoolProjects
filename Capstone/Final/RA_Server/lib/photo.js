
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');


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

exports.upload = multer({storage: storage});