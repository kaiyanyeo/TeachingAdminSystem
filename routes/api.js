var express = require('express');
var router = express.Router();

/* POST a registration.
 * A teacher registers one or more students to a specified teacher.
 */
router.post('/register', function(req, res, next) {
	var registerSql = 'INSERT IGNORE INTO Teachers (temail) VALUES (?); ' +
			'INSERT IGNORE INTO Students (semail) VALUES ?; ' +
			'INSERT IGNORE INTO Registers (temail, semail) SELECT temail,semail FROM (SELECT * FROM Teachers) as A INNER JOIN (SELECT * FROM Students) as B on A.temail=? and B.semail in ? and B.suspended=\'N\'';

	var semail = req.body.students;
	var temail = req.body.teacher;	// should be one teacher
	var students = [];

	// formatting to use in sql query
	semail.forEach((item, index) => {
		students.push([item]);
	})

	// filter out students who have been suspended
	connection.query(registerSql, [temail, students, temail, [students]], function(error, results) {
		if(error) {
			res.send(JSON.stringify({"status": 500, "error": error}));
		} else {
			students = results;
			res.status(204).send();
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
			res.status(200).send(JSON.stringify({"students": students}));
		}
	})
});

/* POST a suspension.
 * A teacher suspends a specified student.
 */
router.post('/suspend', function(req, res, next) {
	var student = req.body.student;
	var suspendSql = 'UPDATE Students SET suspended=\'Y\' WHERE semail=(?);' +
		'DELETE FROM Registers WHERE semail=(?);';

	connection.query(suspendSql, [student, student], function(error, results, fields) {
		if(error)
			res.send(JSON.stringify({"status": 500, "error": error}));
		else 
			res.status(204).send();
	})
});

/* POST notification to students and
 * retrieve a list of students who can receive the notification.
 *
 */
router.post('/retrievefornotifications', function(req, res, next) {
	var teacher = req.body.teacher;
	const emailRegex = /@\S+@\S+/g;
	var mentions = req.body.notification.match(emailRegex);
	var students = [''];

	if(mentions != null) {
		mentions.forEach((mention, index) => {
			students.push(mention.substring(1));
		})
	}

	var retrieveNotifSql = 'SELECT semail FROM Registers WHERE temail = ? UNION ' +
		'SELECT semail FROM Students WHERE semail IN ? AND suspended=\'N\'';

	connection.query(retrieveNotifSql, [teacher, [students]], function(error, results, fields) {
		// formatting the output
		var recipients = [];
		results.forEach((item, index) => {
			recipients.push(item.semail);
		})
		if(error)
			res.send(JSON.stringify({"status": 500, "error": error}));
		else 
			res.status(200).send(JSON.stringify({"recipients": recipients}));
	})
});

module.exports = router;
