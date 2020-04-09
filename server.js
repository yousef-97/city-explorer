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
const client = new pg.Client(process.env.DATABASE_URL);



client.connect()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Listening on PORT${PORT}`);
        });
    })


//handle any route
// localhost:3000/
server.get('/', (req, res) => {//request,response
    res.status(200).send('working baby');
})







//location and weather

server.get('/location', theLocation);

server.get('/weather', theWeather);

server.get('/trails', theTrails);

server.get('/movies', movieHandler);

server.get('/yelp', yelpHandler);



////functions for locations
function theLocation(req, res) {
    // console.log(1);
    const city = req.query.city;
    giveMeTheLocationOf(city)
        .then(loc => {
            // console.log(loc)
            res.status(200).json(loc)
        })

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
                        const locationData = new Location(city, locationSearched.body);
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
        .catch((err) => errorHandler(err));

}


//////functions for weather
let arr = [];
function theWeather(req, res) {
    // console.log(3);
    // const cityWeather = req.query.search_query;
    // console.log(cityWeather);
    giveMeTheWeatherOf(req.query)
        .then(weatherData => {
            res.status(200).json(weatherData)
        })
        .catch((err) => errorHandler(err, req, res));

}

function giveMeTheWeatherOf(witherOfCity) {
    // console.log(4);
    let key = process.env.WEATHER_API_KEY;
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${witherOfCity.search_query}&key=${key}`;
    return superagent.get(url)
        .then(weatherSearched => {
            arr = [];

            // console.log(weatherSearched.body.data);
            weatherSearched.body.data.map(day => {
                new Weather(day);

            });
            // console.log(arr)
            return arr;
        })
}


//////functions for trails
function theTrails(req, res) {
    // console.log(5);
    // const cityTrails = req.query;
    giveMeTheTrailPlan(req)
        .then(hi => {
            res.status(200).json(hi)
        })
        .catch((err) => errorHandler(err, req, res));

}
let arr2 = [];
function giveMeTheTrailPlan(req) {
    // console.log(6);
    const cityTrails = req.query;
    let key = process.env.TRAILS_API_KEY;
    // console.log(cityTrails);
    const url = `https://www.hikingproject.com/data/get-trails?lat=${cityTrails.latitude}&lon=${cityTrails.longitude}&maxDistance=400&key=${key} `;
    // const url = `https://www.hikingproject.com/data/get-trails?lat=40.0274&lon=-105.2519&maxDistance=10&key=${key}`;
    return superagent.get(url)
        .then(trail => {
            arr2 = [];
            trail.body.trails.map(val => {
                new Trails(val);

            })
            return arr2;
        })

}




//constructor for loccation
function Location(city, geoData) {
    this.search_query = city;
    this.formatted_query = geoData[0].display_name;
    this.latitude = geoData[0].lat;
    this.longitude = geoData[0].lon;
}

//constructor for weather
function Weather(weatherData) {
    this.time = new Date(weatherData.datetime).toDateString();
    this.forecast = weatherData.weather.description;
    arr.push(this);
}
//
//constructor for trails
function Trails(trailValues) {
    this.name = trailValues.name;
    this.Location = trailValues.location;
    this.length = trailValues.length;
    this.stars = trailValues.stars;
    this.star_votes = trailValues.starVotes;
    this.summary = trailValues.summary;
    this.trail_url = trailValues.url;
    this.conditions = trailValues.conditionDetails;
    this.condition_date = trailValues.conditionDate;
    this.condition_time = trailValues.conditionDate;
    arr2.push(this);
}


////////moveis/////
function movieHandler(request, response) {
    getMovie(request.query)
        .then(movieData => response.status(200).send(movieData));

}


function getMovie(movieQuery) {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIES_API_KEY}&query=${movieQuery.search_query}`;

    return superagent.get(url)
        .then(data => {
            return data.body.results.map(movie => {
                return new Movies(movie);
            })
        })
        .catch(error => {
            errorHandler(error, req, res);
        })

}

function Movies(data) {
    this.title = data.title;
    this.overview = data.overview;
    this.average_votes = data.vote_average;
    this.popularity = data.popularity;
    this.released_date = data.release_date;
    this.image_url = `https://image.tmdb.org/t/p/w500${data.poster_path}`;

}

///////yelp////
function yelpHandler(request, response) {
    getYelp(request.query)
        .then(yelpData => response.status(200).send(yelpData));

}

function getYelp(yelpQuery) {
    const url = `https://api.yelp.com/v3/businesses/search?location=${yelpQuery.search_query}`


    return superagent.get(url)
        .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`)
        .then(data => {
            // console.log(data.body);
            let yelpPath = data.body.businesses;
            return yelpPath.map(yelp => {
                return new Yelp(yelp)
            })
        })

}

function Yelp(yelp) {
    this.name = yelp.name;
    this.image_url = yelp.image_url;
    this.price = yelp.price;
    this.rating = yelp.rating;
    this.url = yelp.url;
}




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





