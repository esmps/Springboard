-- from the terminal run:
-- psql < air_traffic.sql

DROP DATABASE IF EXISTS air_traffic;

CREATE DATABASE air_traffic;

\c air_traffic

CREATE TABLE tickets
(
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  seat TEXT NOT NULL,
  departure TIMESTAMP NOT NULL,
  arrival TIMESTAMP NOT NULL,
  airline INT NOT NULL REFERENCES airlines,
  from_city_id INT NOT NULL REFERENCES cities,
  from_country_id INT NOT NULL REFERENCES countries,
  to_city_id INT NOT NULL REFERENCES cities,
  to_country_id INT NOT NULL REFERENCES countries
);

CREATE TABLE cities
(
  id SERIAL PRIMARY KEY,
  city TEXT NOT NULL;
);

CREATE TABLE countries
(
  id SERIAL PRIMARY KEY,
  country TEXT NOT NULL;
);
CREATE TABLE airlines
(
  id SERIAL PRIMARY KEY,
  airline TEXT NOT NULL;
);