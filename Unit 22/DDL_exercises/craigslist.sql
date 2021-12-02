DROP DATABASE IF EXISTS craigslist;

CREATE DATABASE craigslist;

\c craigslist;

CREATE TABLE regions (id SERIAL PRIMARY KEY, region TEXT);
CREATE TABLE locations (id SERIAL PRIMARY KEY, location TEXT);
CREATE TABLE categories (id SERIAL PRIMARY KEY, category TEXT);
CREATE TABLE users (id SERIAL PRIMARY KEY, username TEXT UNIQUE, password TEXT NOT NULL, preferred_region_id INT REFERENCES regions);
CREATE TABLE posts (id SERIAL PRIMARY KEY, user_id INT REFERENCES users, title TEXT, text TEXT, location_id INT REFERENCES locations, region_id INT REFERENCES regions, category_id INT REFERENCES categories);


INSERT INTO regions (region) VALUES ('SF Bay Area');
INSERT INTO regions (region) VALUES ('Greater Los Angeles');
INSERT INTO regions (region) VALUES ('New York City');

INSERT INTO locations (location) VALUES ('San Jose');
INSERT INTO locations (location) VALUES ('Malibu');
INSERT INTO locations (location) VALUES ('Brooklyn');

INSERT INTO categories (category) VALUES ('For Sale');
INSERT INTO categories (category) VALUES ('Jobs');
INSERT INTO categories (category) VALUES ('Missed Connections');

INSERT INTO users (username, password, preferred_region_id) VALUES ('coolguy123', 'password321', 1);
INSERT INTO users (username, password, preferred_region_id) VALUES ('garfield', 'ihatemondays333', 3);
INSERT INTO users (username, password, preferred_region_id) VALUES ('randomstuff', 'lkvnvkfdkvdv45', 2);

INSERT INTO posts (user_id, title, text, location_id, region_id, category_id) VALUES (3, 'Household items', 'Selling some household items bc I am moving. Prices vary', 2, 2, 1);
INSERT INTO posts (user_id, title, text, location_id, region_id, category_id) VALUES (1, 'Corner of Moreland and Tasman', 'You were wearing a red hoodie, walking your dog. We talked about movies', 1, 1, 3);
INSERT INTO posts (user_id, title, text, location_id, region_id, category_id) VALUES (2, 'Looking for Assistant', 'M-F 9-5, looking for someone to help me out with day-to-day tasks. Every day will be different. Please send resume.', 3, 3, 2);