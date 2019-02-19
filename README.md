# TeachingAdminSystem
* API endpoints of a system for teachers to perform administrative functions for their students.
* This system is set up using ExpressJS, referencing [this tutorial](https://medium.com/@avanthikameenakshi/building-restful-api-with-nodejs-and-mysql-in-10-min-ff740043d4be) to build example APIs,
and [express-generator](https://expressjs.com/en/starter/generator.html) to set up a directory with ExpressJS.
* MySQL is used as the database.

# Setting up the system locally
## Setting up MySQL
* [Download](https://dev.mysql.com/downloads/installer/) and install MySQL, if necessary.
* For security concerns, this system has been set up with a connection to a local MySQL database with
[`user: 'foo', password : 'bar'`](https://github.com/kaiyanyeo/TeachingAdminSystem/blob/b8ad628d5a5aea283e6c443ef5395cc9fd9c3900/app.js#L27-L28).
Hence, run the following script in your MySQL workbench to set up a local connection with the same credentials:
```
CREATE USER 'foo'@'localhost' IDENTIFIED WITH mysql_native_password BY 'bar';
-- then
FLUSH PRIVILEGES;
GRANT ALL PRIVILEGES ON *.* TO 'foo'@'localhost'
WITH GRANT OPTION;
```
 * Alternatively, change the corresponding lines to your local system credentials that you have set up.
```NEVER reveal or commit important security information, like your root user and password.```

## Run your database
* Ensure your MySQL databse is up and running when using this system. You can check it easily in the MySQL Workbench.
* Execute the `create_eg_db.sql` in MySQL for an example database with some values. You can do so by the command line
```
mysql> source <path to file>\create_eg_db.sql;
```
* Refer to `create_eg_db.sql` for the database design that has been set up with this system.

## Run the API endpoints locally
* Run the following command in the directory of this system, to launch the ExpressJS application.
```
set DEBUG=TeachingAdminSystem:* & npm start
```
OR
```
set DEBUG=TeachingAdminSystem:* & nodemon --exec npm start
```
to refresh any changes to your application during development. Explanation on the command available
[here](https://stackoverflow.com/questions/36240385/explanation-for-what-debug-myapp-npm-start-is-actually-doing).

## Testing API calls with Postman
* You can choose to use [Postman](https://www.getpostman.com/downloads/) for calling the API endpoints.
* You can access [this Postman collection](https://www.getpostman.com/collections/daeeb9a4e9cb171b8d38) for some example calls.

# System design
### User stories
1. As a teacher, I want to register one or more students to a specified teacher.
A teacher can register multiple students. A student can also be registered to multiple teachers.
 - Endpoint: POST /api/register
 - Headers: Content-Type: application/json
 - Success response status: HTTP 204
 - Request body example:
 ```json
  {
    "teacher": "teacherken@gmail.com",
    "students": [
      "studentjon@example.com",
      "studenthon@example.com"
    ]
  }
```
2. As a teacher, I want to retrieve a list of students common to a given list of teachers (i.e. retrieve students who are registered to ALL of the given teachers).
 - Endpoint: GET /api/commonstudents
 - Success response status: HTTP 200

 * Request example 1: GET /api/commonstudents?teacher=teacherken%40example.com
 * Success response body 1:
```json
  {
    "students" : [
      "commonstudent1@gmail.com",
      "commonstudent2@gmail.com",
      "student_only_under_teacher_ken@gmail.com"
    ]
  }
```
 * Request example 2: GET /api/commonstudents?teacher=teacherken%40example.com&teacher=teacherjoe%40example.com
 * Success response body 2:
```json
  {
    "students" : [
      "commonstudent1@gmail.com",
      "commonstudent2@gmail.com"
    ]
  }
```
3. As a teacher, I want to suspend a specified student.
 - Endpoint: POST /api/suspend
 - Headers: Content-Type: application/json
 - Success response status: HTTP 204
 
 * Request body example:
```json
  {
    "student" : "studentmary@gmail.com"
  }
```
4. As a teacher, I want to retrieve a list of students who can receive a given notification. A notification consists of:
 - the teacher who is sending the notification, and
 - the text of the notification itself.
 - To receive notifications from e.g. 'teacherken@example.com', a student:
    * MUST NOT be suspended,
    * AND MUST fulfill AT LEAST ONE of the following:
      1. is registered with “teacherken@example.com"
      2. has been @mentioned in the notification
 - The list of students retrieved should not contain any duplicates/repetitions.
 
 - Endpoint: POST /api/retrievefornotifications
 - Headers: Content-Type: application/json
 - Success response status: HTTP 200
 * Request body example 1:
```json
  {
    "teacher": "teacherken@example.com",
    "notification": "Hello students! @studentagnes@example.com @studentmiche@example.com"
  }
```
 * Success response body 1:
```json
  {
    "recipients": [
      "studentbob@example.com",
      "studentagnes@example.com",
      "studentmiche@example.com"
    ]
  }
```
In the example above, studentagnes@example.com and studentmiche@example.com can receive the notification from teacherken@example.com, 
regardless of whether they are registered to him, because they are @mentioned in the notification text. `studentbob@example.com` however,
has to be registered to teacherken@example.com.

 * Request body example 2:
```json
  {
    "teacher": "teacherken@example.com",
    "notification": "Hey everybody"
  }
```
 * Success response body 2:
```json
  {
    "recipients":[
      "studentbob@example.com",
    ]
  }
```
### Error Responses
For all the above API endpoints, error responses should:
 - have an appropriate HTTP response code
 - have a JSON response body containing a meaningful error message:
```json
{ "message": "Some meaningful error message" }
```
