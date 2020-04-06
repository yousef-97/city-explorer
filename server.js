'use strict';
const express = require('express');


//CORS: cross origin resource sharing
const cors = require('cors');

//dotenv (to read our enviroment varisble)
require('dotenv').config();

//superagent definition
const superagent = require('superagent');

const PORT = process.env.PORT || 3000;

const server = express();
server.use(cors());
server.listen(PORT, () =>{
    console.log(`Listening on PORT${PORT}`);
})


//handle any route
// localhost:3000/
server.get('/',(req,res)=>{//request,response
    res.status(200).send('working baby');
})

//location and weather

server.get('/location',theLocation);

server.get('/weather',theWeather);

server.get('/trails',theTrails);


////functions for locations
let loc = [];
function theLocation(req, res){
    const city = req.query.city;
    giveMeTheLocationOf(city)
    .then(hi=> res.status(200).json(hi))//some thing weird
}


function giveMeTheLocationOf(city){
    const key = process.env.LOCATION_API_KEY;
    const url = `https://eu1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;

    return superagent.get(url)
    .then(locationSearched=>{
        // console.log(locationSearched)
        const locationData =new Location(city, locationSearched.body);
        loc.push(locationData);
        return locationData;
    })
}


//////functions for weather
let arr =[];
function theWeather(req, res){
    const cityWeather = req.query.search_query;
    // console.log(cityWeather);
    giveMeTheWeatherOf(cityWeather)
    .then (weatherData => res.status(200).json(weatherData));

}

function giveMeTheWeatherOf(witherOfCity){
    let key = process.env.WEATHER_API_KEY;
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${witherOfCity}&key=${key}`;
    return superagent.get(url)
    .then(weatherSearched=>{
        arr =[];
        console.log(weatherSearched.body);
        weatherSearched.body.data.map(day =>{
            new Weather(day);
            
        });
        // console.log(arr)
        return arr;
    })
}


//////functions for trails
function theTrails(req,res){
    const cityTrails = req.query;
    giveMeTheTrailPlan(cityTrails)
    .then(hi=>res.status(200).json(hi));
    
}
let arr2 =[];
function giveMeTheTrailPlan(cityTrails){
    let key = process.env.TRAILS_API_KEY;
    // console.log(cityTrails);
    const url = `https://www.hikingproject.com/data/get-trails?lat=${cityTrails. latitude}&lon=${cityTrails.longitude}&key=${key} `;
    //https://www.hikingproject.com/data/get-trails?lat=40.0274&lon=-105.2519&maxDistance=10&key=200721159-1a
    return superagent.get(url)
    .then(trail=>{
        arr2 =[];
        trail.body.trails.map(val=>{
            new Trails(val);
            
        })
        return arr2;
    })
}




//constructor for loccation
function Location(city, geoData){
    this.search_query = city;
    this.formatted_query = geoData[0].display_name;
    this.latitude = geoData[0].lat;
    this.longitude = geoData[0].lon;
}

//constructor for weather
function Weather(weatherData){
    this.time =  new Date(weatherData.datetime).toDateString();
    this.forecast = weatherData.weather.description;
    arr.push(this);
}
//
//constructor for trails
function Trails(trailValues){
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


///////////////////for the end ////////////////

//localhost:3000/anything
server.use('*',(req,res)=>{
    // '*' for all 
    res.status(404).send('NOT FOUND');
});

//for error
server.use((error,req,res)=>{
    res.status(500).send(error);
})








// localhost:3000/location?city=Lynnwood
// server.get('/location',(req,res)=>{
//     const geoData = require('./data/geo.json');  //old way static
//     const city = req.query.city;//that in URL after ? mark
//     const locationData = new Location(city, geoData);
//     res.send(locationData);
    
// })