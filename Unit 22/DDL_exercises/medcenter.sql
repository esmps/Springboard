DROP DATABASE IF EXISTS medical_center;

CREATE DATABASE medical_center;

\c medical_center;

CREATE TABLE doctors (id SERIAL PRIMARY KEY, name TEXT, specialty TEXT);
CREATE TABLE patients (id SERIAL PRIMARY KEY, name TEXT, birthdate DATE, insurance TEXT);
CREATE TABLE diseases (id SERIAL PRIMARY KEY, name TEXT, description TEXT);
CREATE TABLE visits (id SERIAL PRIMARY KEY, patient_id INT REFERENCES patients, dr_id INT REFERENCES doctors);
CREATE TABLE diagnoses (id SERIAL PRIMARY KEY, visit_id INT REFERENCES visits, disease_id INT REFERENCES diseases, notes TEXT);


INSERT INTO doctors (name, specialty) VALUES ('John Smith', 'Pediatrics');
INSERT INTO doctors (name, specialty) VALUES ('Jane Doe', 'Primary Care');
INSERT INTO doctors (name, specialty) VALUES ('Daniel Pines', 'Oncology');

INSERT INTO patients (name, birthdate, insurance) VALUES ('Julia Schwartz', '1994-03-05', 'Kaiser Permanente');
INSERT INTO patients (name, birthdate, insurance) VALUES ('Alex Specter', '1974-06-25', 'Kaiser Permanente');
INSERT INTO patients (name, birthdate, insurance) VALUES ('Matthew Ross', '2015-05-02', 'Blue Cross Blue Shield');

INSERT INTO visits (patient_id, dr_id) VALUES (1, 3);
INSERT INTO visits (patient_id, dr_id) VALUES (2, 2);
INSERT INTO visits (patient_id, dr_id) VALUES (3, 1);

INSERT INTO diseases (name, description) VALUES ('breast cancer', 'A cancer that forms in the cells of the breasts. Breast cancer can occur in women and rarely in men. Symptoms of breast cancer include a lump in the breast, bloody discharge from the nipple, and changes in the shape or texture of the nipple or breast. Treatment depends on the stage of cancer. It may consist of chemotherapy, radiation, and surgery.');
INSERT INTO diseases (name, description) VALUES ('coronavirus', 'COVID-19 is caused by a coronavirus called SARS-CoV-2. Older adults and people who have severe underlying medical conditions like heart or lung disease or diabetes seem to be at higher risk for developing more serious complications from COVID-19 illness.');
INSERT INTO diseases (name, description) VALUES ('Atopic dermatitis', 'An itchy inflammation of the skin.
Atopic dermatitis usually develops in early childhood and is more common in people who have a family history of the condition.
The main symptom is a rash that typically appears on the arms and behind the knees, but can also appear anywhere.
Treatment includes avoiding soap and other irritants. Certain creams or ointments also may provide relief from the itching.');

INSERT INTO diagnoses (visit_id, disease_id, notes) VALUES (1, 1, 'chemo required');
INSERT INTO diagnoses (visit_id, disease_id, notes) VALUES (2, 3, 'prescribed topical cream');
INSERT INTO diagnoses (visit_id, disease_id, notes) VALUES (3, 2, 'monitor symptoms, if symptoms worsen, hospitalize');