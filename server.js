'use strict';

//dotenv (to read our enviroment varisble)
require('dotenv').config();


/////////////the required (dependencies)////////////
const express = require('express');
//CORS: cross origin resource sharing
const cors = require('cors');
//for pg mod
const pg = require('pg');
//superagent definition
const superagent = require('superagent');



const PORT = process.env.PORT || 3000;

const server = express();

server.use(cors());

//open it after creating database

// const client = new pg.Client(process.env.DATABASE_URL);



// client.connect()
// .then(() => {
    server.listen(PORT, () => {
        console.log(`Listening on PORT${PORT}`);
    });
// })



//handle any route
// localhost:3000/
server.get('/', (req, res) => {//request,response
    res.status(200).send('working baby');
})


///to use the founctions in other files
const theLocationHandler = require('./location.js');
const theWeatherHandler = require('./weather.js');
const theTrailsHandler = require('./trails.js');
const theMoviesHandler = require('./movies.js');
const theYelpHandler = require('./yelp.js');



//the routes

server.get('/location', theLocationHandler);


server.get('/weather', theWeatherHandler);

server.get('/trails', theTrailsHandler);

server.get('/movies', theMoviesHandler);

server.get('/yelp', theYelpHandler);


//////////////for the end ////////////////

//localhost:3000/
server.use('*', (req, res) => {
    // '*' for all 
    res.status(404).send('NOT FOUND');
});

//for error
server.use((error, req, res) => {
    res.status(500).send(error);
})
function errorHandler(error, request, response) {
    response.status(500).send(error);
}





