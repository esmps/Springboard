-- from the terminal run:
-- psql < music.sql

DROP DATABASE IF EXISTS music;

CREATE DATABASE music;

\c music

CREATE TABLE artists
(
  id SERIAL PRIMARY KEY,
  artist TEXT NOT NULL
);

CREATE TABLE producers
(
  id SERIAL PRIMARY KEY,
  producer TEXT NOT NULL
);

CREATE TABLE albums
(
  id SERIAL PRIMARY KEY,
  album TEXT NOT NULL
);


CREATE TABLE songs
(
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  duration_in_seconds INTEGER NOT NULL,
  release_date DATE NOT NULL,
  artist_id INT NOT NULL REFERENCES artists,
  collab_artist_id INT REFERENCES artists,
  collab_artist2_id INT REFERENCES artists,
  album_id INT NOT NULL REFERENCES albums,
  producer_id INT NOT NULL REFERENCES producers,
  collab_producer_id INT REFERENCES producers
);
