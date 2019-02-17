var express = require('express');
var router = express.Router();

var insertTeacherSql = 'INSERT IGNORE INTO Teachers (temail) VALUES (?)';
var insertStudentSql = 'INSERT IGNORE INTO Students (semail) VALUES (?);';
var insertRegisterSql = 'INSERT IGNORE INTO Registers (temail, semail) VALUES (?,?)';
var registerPairs = [];

/* POST a registration.
 * A teacher registers one or more students to a specified teacher.
 */
router.post('/register', function(req, res, next) {
	var semail = req.body.students;
	var temail = req.body.teacher;
	for(var i=0; i<semail.length; i++) {
		registerPairs.push(temail, semail[i]);
	}

	connection.query(insertTeacherSql, temail, function(error, results, fields) {
		if(error)
			res.send(JSON.stringify({"status": 500}));
	}),
	connection.query(insertStudentSql, semail, function(error, results, fields) {
		if(error)
			res.send(JSON.stringify({"status": 500}));
	}),
	connection.query(insertRegisterSql, registerPairs, function(error, results, fields) {
		if(error) {
			res.send(JSON.stringify({"status": 500}));
		} else {
			res.send(JSON.stringify({"status": 204, "error": null, "response": results}));
		}
	})
});



module.exports = router;
