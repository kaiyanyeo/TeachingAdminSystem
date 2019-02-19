
DROP TABLE IF EXISTS Registers;
DROP TABLE IF EXISTS Students;
DROP TABLE IF EXISTS Teachers;

CREATE TABLE Students (
	semail 			VARCHAR(50),
	suspended		CHAR(1) DEFAULT 'N',
	PRIMARY KEY (semail)
);

CREATE TABLE Teachers (
	temail 			VARCHAR(50),
	PRIMARY KEY (temail)
);

CREATE TABLE Registers (
	temail			VARCHAR(50),
	semail 			VARCHAR(50),
	PRIMARY KEY (temail,semail),
	FOREIGN KEY (semail) references Students(semail) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (temail) references Teachers(temail) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT  INTO Students (semail) VALUES ('benny@example.com');
INSERT  INTO Students (semail) VALUES ('cindy@example.com');
INSERT  INTO Students (semail) VALUES ('dick@gmail.com');
INSERT  INTO Students (semail) VALUES ('fanny@gmail.com');
INSERT  INTO Students (semail) VALUES ('harry@hotmail.com');
INSERT  INTO Students (semail) VALUES ('jane@hotmail.com');
INSERT  INTO Students (semail) VALUES ('jenny@hotmail.com');
INSERT  INTO Students (semail) VALUES ('jerry@example.com');
INSERT  INTO Students (semail) VALUES ('mickey@example.com');
INSERT  INTO Students (semail) VALUES ('paul@hotmail.com');
INSERT  INTO Students (semail) VALUES ('studenthon@example.com');
INSERT  INTO Students (semail) VALUES ('studentjon@example.com');
INSERT  INTO Students (semail) VALUES ('tom@example.com');
INSERT  INTO Students (semail) VALUES ('walt@hotmail.com');

INSERT  INTO Teachers (temail) VALUES ('teacherdanny@yahoo.com');
INSERT  INTO Teachers (temail) VALUES ('teacherdisney@yahoo.com');
INSERT  INTO Teachers (temail) VALUES ('teacherjoe@example.com');
INSERT  INTO Teachers (temail) VALUES ('teacherken@gmail.com');
INSERT  INTO Teachers (temail) VALUES ('teacherlim@gmail.com');
INSERT  INTO Teachers (temail) VALUES ('teacherrobert@yahoo.com');
INSERT  INTO Teachers (temail) VALUES ('teachertom@yahoo.com');

INSERT  INTO Registers (temail,semail) VALUES ('teacherdanny@yahoo.com','fanny@gmail.com');
INSERT  INTO Registers (temail,semail) VALUES ('teacherdanny@yahoo.com','harry@hotmail.com');