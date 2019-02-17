var express = require('express');
var http = require('http');
var router = express.Router();

/* GET teachers listing. */
router.get('/', function(req, res, next) {
	connection.query('SELECT * from teachers', function (error, results, fields) {
	  	if(error){
	  		res.send(JSON.stringify({"status": 500, "error": error, "response": "Server error in retrieving data"})); 
			  // If there is error, we send the error in the error section with 500 status
			  // 500 INTERNAL SERVER ERROR, cannot retrieve records
	  	} else {
  			res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  			// If there is no error, all is good and response is 200 OK.
	  	}
  	});
});


module.exports = router;
