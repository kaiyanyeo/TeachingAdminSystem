var express = require('express');
var router = express.Router();

/* POST a registration.
 * A teacher registers one or more students to a specified teacher.
 */
router.post('/register', function(req, res, next) {
	var insertTeacherSql = 'INSERT IGNORE INTO Teachers (temail) VALUES (?)';
	var insertStudentSql = 'INSERT IGNORE INTO Students (semail) VALUES (?);';
	var insertRegisterSql = 'INSERT IGNORE INTO Registers (temail, semail) VALUES (?,?)';
	var registerPairs = [];

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

/* GET list of common students.
 * A teacher retrieves a list of students registered to all the given teachers.
 */
router.get('/commonstudents', function(req, res, next) {
	var teachers = req.query.teacher;
	var length = (typeof(teachers) === 'string') ? 1 : teachers.length;
	var getRowsSql = 'SELECT semail FROM Registers WHERE temail IN (?) GROUP BY semail HAVING count(distinct temail) = ' + length;

	connection.query(getRowsSql, [teachers], function(error, results, fields) {
		// formatting the output
		var students = [];
		results.forEach((item, index) => {
			students.push(item.semail);
		})

		if(error)
			res.send(JSON.stringify({"status": 500, "error": error}));
		else {
			res.send(JSON.stringify({"status": 200, "error": null, "students": students}));
		}
	})
});

module.exports = router;
