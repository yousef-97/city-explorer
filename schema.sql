DROP TABLE IF EXISTS locations;

CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    searchquery VARCHAR(255),
    formattedquery VARCHAR(255),
    latitude NUMERIC(255),
    longitude NUMERIC(255)
);
-- INSERT INTO locations (searchquery,latitude,longitude) VALUES ('amman',12345,123456);