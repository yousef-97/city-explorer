'use strict';
const express = require('express');

//dotenv (to read our enviroment varisble)
require('dotenv').config();

//CORS: cross origin resource sharing
const cors = require('cors');

//for pg mod
const pg = require('pg');

//superagent definition
const superagent = require('superagent');

const PORT = process.env.PORT || 3000;

//open it after creating database
const client  = new pg.Client(process.env.DATABASE_URL);
client.on('error',error=>{
    throw new Error(error);
})

const server = express();
server.use(cors());

client.connect()
.then(()=>{
    server.listen(PORT, () =>{
        console.log(`Listening on PORT${PORT}`);
    });
})


//handle any route
// localhost:3000/
server.get('/',(req,res)=>{//request,response
    res.status(200).send('working baby');
})



///data base stuff  http://localhost:3200/readlocations
// server.get('/location',(request,response)=>{
//     const city = request.query.city;

//     let SQL =` SELECT * FROM locations WHERE searchquery = '${city}';`;
//     client.query(SQL)
//     .then(results =>{
//         if(results.rows.length>0){
//             response.status(200).json(results.rows[0]);
//         }
//         else{
//             giveMeTheLocationOf(city)
//             .then(results=>{
//                 let searchQuery = results.search_query;
//                 let formattedQuery = results.formatted_query;
//                 let latitude = results.latitude;
//                 let longitude = results.longitude;
                
//                 let toCheckIfSafeValues = [searchQuery,formattedQuery,latitude,longitude];
//                 let SQL = 'INSERT INTO locations (searchquery,formattedquery,latitude,longitude) VALUES ($1,$2,$3,$4)';
//                 client.query(SQL,toCheckIfSafeValues)
//                 .then(results =>{
//                     response.status(200).json(results.rows[0]);
//                 })
//                 // newInDataBase(request,response)
//             })

//         }
//     })
//     // .catch (error => errorHandler(error));
// })

//http://localhost:3200/add?city=[]&lat=[]&lon=[];
//http://localhost:3200/add?city=amman&lat=31.9515694&lon=35.9239625

// server.get('/add',(request,response)=>{
// function newInDataBase(request,response){    
    // let searchQuery = request.query.city;
    // let formattedQuery = request.query.formattedquery;
    // let latitude = request.query.lon;
    // let longitude = request.query.lat;
    
    // let toCheckIfSafeValues = [searchQuery,formattedQuery,latitude,longitude];
    // let SQL = 'INSERT INTO locations (searchquery,formattedquery,latitude,longitude) VALUES ($1,$2,$3,$4)';
    // return client.query(SQL,toCheckIfSafeValues)
    // .then(results =>{
    //     response.status(200).json(results.rows[0]);
    // })
    // .catch (error => errorHandler(error));
// }
    
// })



//location and weather

server.get('/location',theLocation);

server.get('/weather',theWeather);

server.get('/trails',theTrails);


////functions for locations
function theLocation(req, res){
    const city = req.query.city;
    let SQL =` SELECT * FROM locations WHERE search_query = ($1);`;
    let safeValue = [city];
    client.query(SQL,safeValue)
    .then(results =>{
        // console.log(results)
        if(results.rows.length>0){
            // console.log(results.rows[0])
            giveMeTheWeatherOf(city);
            giveMeTheTrailPlan(req);
            res.status(200).json(results.rows[0]);
        }
        else{
            giveMeTheLocationOf(city)
            .then(hi=>{
                // console.log(giveMeTheLocationOf(city));
                giveMeTheWeatherOf(city);
                 giveMeTheTrailPlan(req);
                let toCheckIfSafeValues = [hi.search_query,hi.formatted_query,hi.latitude,hi.longitude];
                let SQL = 'INSERT INTO locations (search_query,formatted_query,latitude,longitude) VALUES ($1,$2,$3,$4)';
                client.query(SQL,toCheckIfSafeValues)
                .then(results =>{
                    // console.log(results)
                    // console.log(results.rows);
                res.status(200).json(hi);
                })
                .catch((err) => errorHandler(err, req, res));

            })
        }
    })
    .catch((err) => errorHandler(err, req, res));
}


function giveMeTheLocationOf(city){
    // console.log(city);//////////its work 
    const key = process.env.LOCATION_API_KEY;
    const url = `https://eu1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;

    return superagent.get(url)
    .then(locationSearched=>{
        // console.log(locationSearched)
        const locationData =new Location(city, locationSearched.body);
        
        return locationData;
    })
}


//////functions for weather
let arr =[];
function theWeather(req, res){
    const cityWeather = req.query.search_query;
    // console.log(cityWeather);
    giveMeTheWeatherOf(cityWeather)
    .then (weatherData => {
        res.status(200).json(weatherData)
    })
    .catch((err) => errorHandler(err, req, res));

}

function giveMeTheWeatherOf(witherOfCity){
    let key = process.env.WEATHER_API_KEY;
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${witherOfCity}&key=${key}`;
    return superagent.get(url)
    .then(weatherSearched=>{
        arr =[];
        
        // console.log(weatherSearched.body.data);
        weatherSearched.body.data.map(day =>{
            new Weather(day);
            
        });
        // console.log(arr)
        return arr;
    })
}


//////functions for trails
function theTrails(req,res){
    // const cityTrails = req.query;
    giveMeTheTrailPlan(req)
    .then(hi=>{
        res.status(200).json(hi)
    })
    .catch((err) => errorHandler(err, req, res));
    
}
let arr2 =[];
function giveMeTheTrailPlan(req){
    const cityTrails = req.query;
    let key = process.env.TRAILS_API_KEY;
    // console.log(cityTrails);
    const url = `https://www.hikingproject.com/data/get-trails?lat=${cityTrails.latitude}&lon=${cityTrails.longitude}&maxDistance=300&key=${key} `;
    // const url = `https://www.hikingproject.com/data/get-trails?lat=40.0274&lon=-105.2519&maxDistance=10&key=${key}`;
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


function errorHandler(error, request, response) {
    response.status(500).send(error);
}

