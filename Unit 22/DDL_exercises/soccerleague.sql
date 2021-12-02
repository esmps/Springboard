DROP DATABASE IF EXISTS soccer_league;

CREATE DATABASE soccer_league;

\c soccer_league;

CREATE TABLE teams (id SERIAL PRIMARY KEY, name TEXT, ranking TEXT);
CREATE TABLE referees (id SERIAL PRIMARY KEY, name TEXT);
CREATE TABLE players (id SERIAL PRIMARY KEY, name TEXT, height TEXT, team_id INT REFERENCES teams);
CREATE TABLE seasons (id SERIAL PRIMARY KEY, start_date DATE, end_date DATE);
CREATE TABLE matches (id SERIAL PRIMARY KEY, team1_id INT REFERENCES teams, team2_id INT REFERENCES teams, location TEXT, date DATE, start_time TEXT, season_id INT REFERENCES seasons, primary_ref_id INT REFERENCES referees, assistant_ref_id INT REFERENCES referees, results TEXT);
CREATE TABLE goals (id SERIAL PRIMARY KEY, match_id INT REFERENCES matches, player_id INT REFERENCES players);