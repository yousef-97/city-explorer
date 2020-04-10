'use strict';

//dotenv (to read our enviroment varisble)
require('dotenv').config();


const superagent = require('superagent');

///to use constructors file
let toUseTrailsConstructor = require('./construtors.js');

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
    return superagent.get(url)
        .then(trail => {
            arr2 = [];
            trail.body.trails.map(val => {
               let miow =  new toUseTrailsConstructor.trails(val);
                arr2.push(miow);
            })
            return arr2;
        })

}

function errorHandler(error, request, response) {
    response.status(500).send(error);
}


module.exports = theTrails;

