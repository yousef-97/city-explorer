DROP TABLE IF EXISTS locations;

CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    search_query VARCHAR(255),
    formatted_query VARCHAR(255),
    latitude NUMERIC(255),
    longitude NUMERIC(255)
);
-- INSERT INTO locations (searchquery,latitude,longitude) VALUES ('amman',12345,123456);