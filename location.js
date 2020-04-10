'use strict';


//dotenv (to read our enviroment varisble)
require('dotenv').config();

///to use constructors file
let toUseLocationConstructor = require('./construtors.js');

//for pg mod
const pg = require('pg');
//superagent definition
const superagent = require('superagent');

//open it after creating database
const client = new pg.Client(process.env.DATABASE_URL);

client.connect()



const theLocation = function(req, res) {
    const city = req.query.city;
    giveMeTheLocationOf(city)
    .then(loc => {
        // console.log(loc)
        res.status(200).json(loc)
    })
    .catch(error => {errorHandler(error, req, res);})

    
}


function giveMeTheLocationOf(city) {
    // console.log(2);
    let SQL = ` SELECT * FROM locations WHERE search_query = $1;`;
    let safeValue = [city];
    return client.query(SQL, safeValue)
        .then(results => {
            if (results.rows.length > 0) {
                console.log('in data base');
                return results.rows[0];
            }
            else {
                console.log('not in data base')
                const key = process.env.LOCATION_API_KEY;
                const url = `https://eu1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;

                return superagent.get(url)
                    .then(locationSearched => {
                        // console.log('im here')
                        // console.log(locationSearched)
                        const locationData = new toUseLocationConstructor.location(city, locationSearched.body);
                        // console.log(locationData)
                        let toCheckIfSafeValues = [locationData.search_query, locationData.formatted_query, locationData.latitude, locationData.longitude];
                        let SQL = 'INSERT INTO locations (search_query,formatted_query,latitude,longitude) VALUES ($1,$2,$3,$4);';
                        client.query(SQL, toCheckIfSafeValues)
                        // .then(results => {
                        //     console.log(results);
                        //     results.rows[0];
                        // })


                        return locationData;
                    })


            }


        })


}

function errorHandler(error, request, response) {
    response.status(500).send(error);
}

///for expoting
module.exports = theLocation;
