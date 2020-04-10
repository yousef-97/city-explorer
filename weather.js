'use strict';



//dotenv (to read our enviroment varisble)
require('dotenv').config();

let toUseWeatherConstructor = require('./construtors.js');


/////////////the required (dependencies)////////////
//superagent definition
const superagent = require('superagent');



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
                let boy = new toUseWeatherConstructor.weather(day);
                arr.push(boy);
            });
            // console.log(arr)
            return arr;
        })
}


module.exports = theWeather;

function errorHandler(error, request, response) {
    response.status(500).send(error);
}
