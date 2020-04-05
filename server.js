'use strict';
const express = require('express');


//CORS: cross origin resource sharing
const cors = require('cors');

//dotenv (to read our enviroment varisble)
require('dotenv').config();

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


// localhost:3000/location?city=Lynnwood
server.get('/location',(req,res)=>{
    const geoData = require('./data/geo.json');
    const city = req.query.city;
    const locationData = new Location(city, geoData);
    res.send(locationData);
    
})

let arr =[];
// localhost:3000/weather?city=Amman
server.get('/weather',(req,res)=>{
    const weather = require('./data/weather.json');
    const cityWeather = req.query.city;
    
    weather.data.forEach(val=>{
        new Weather(cityWeather, val);        
    })
    res.send(arr);
    
})
//constructor for loccation
function Location(city, geoData){
    this.search_query = city;
    this.formatted_query = geoData[0].display_name;
    this.latitude = geoData[0].lat;
    this.longitude = geoData[0].lon;
}

//constructor for weather
function Weather(city, weatherData){
    this.search_query = city;
    // this.formatted_query = weatherData[0].display_name;
    this.time =  new Date(weatherData.datetime).toDateString();
    this.forecast = weatherData.weather.description;
    arr.push(this);
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
