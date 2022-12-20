--Drop tables
drop table if exists mentors CASCADE;
drop table if exists students CASCADE;
drop table if exists classes CASCADE;
drop table if exists class_attendence;


--create tables
CREATE TABLE if not exists mentors (
  id       		SERIAL PRIMARY KEY,
  name     		VARCHAR(30) NOT NULL,
  years   		smallint NOT NULL,
  address  		VARCHAR(120),
  language_fav  VARCHAR(20)
);

CREATE TABLE if not exists students (
  id       		SERIAL PRIMARY KEY,
  name     		VARCHAR(30) NOT NULL,
  address  		VARCHAR(120) NOT NULL,
  graduated  	Boolean NOT NULL
);

CREATE TABLE if not exists classes (
  id       		SERIAL PRIMARY KEY,
  mentor_id     INT REFERENCES mentors(id),
  topic  		VARCHAR(30),
  date  		DATE,
  location 		VARCHAR(30)
);

CREATE TABLE if not exists class_attendence (
  id        	SERIAL PRIMARY KEY,
  student_id 	INT REFERENCES students(id),
  class_id 		INT REFERENCES classes(id)
);


--insert dates into tables
INSERT INTO mentors(name, years, address, language_fav) VALUES
		('Anna', 4, 'Enamorats 44', 'Javascript'),
		('Olga', 3, 'Enamorats 40', 'SQL'),
 		('Katya', 1, 'Pujes 44', 'Java'),
		('Alesya', 8, 'Diagonal 144', 'Javascript'),
	    ('Elena', 5, 'Arago 140', 'Ruby');

INSERT INTO students(name, address, graduated) VALUES 
		('Hanna', 'Rome', true),
		('Denis', 'London', false),
		('Artsem', 'Nice', true),
		('Nastya', 'Lisbon', true),
		('Katya', 'London', false),
		('Kostya', 'Malaga', true),
		('Anton', 'Minsk', true),
		('Roma', 'Barcelona', false),
		('Yulia', 'Krakow', true),
		('Alexsandr', 'London', true);
	
INSERT INTO classes (mentor_id, topic, date, location) VALUES
	 	(1,'Javascript','2022-12-01','online'),
		(2,'SQL','2022-12-31','offline'),
	 	(3,'Java','2022-12-20','online');
	
INSERT INTO class_attendence (student_id, class_id) VALUES
		(1,2),
   	    (5,2),
    	(2,3),
    	(9,1);
	
	
--select
	SELECT * FROM students; 
    SELECT * FROM mentors;
    SELECT * FROM mentors WHERE years > 5;
    SELECT * FROM mentors WHERE language_fav = 'Javascript';
    SELECT * FROM students WHERE graduated = true;
    SELECT * FROM classes WHERE date < '2022-06-01';
   
   SELECT * FROM students WHERE id in 
   (SELECT student_id FROM class_attendence WHERE class_id  in
   (SELECT id FROM classes WHERE topic = 'Javascript' ));
