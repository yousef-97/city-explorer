'use strict';

const allConstructor = {};

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
}



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
}


////constructor for movies
function Movies(data) {
    this.title = data.title;
    this.overview = data.overview;
    this.average_votes = data.vote_average;
    this.popularity = data.popularity;
    this.released_date = data.release_date;
    this.image_url = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
    
}


/// constructor for yelp
function Yelp(yelp) {
    this.name = yelp.name;
    this.image_url = yelp.image_url;
    this.price = yelp.price;
    this.rating = yelp.rating;
    this.url = yelp.url;
}

allConstructor.location =Location;
allConstructor.weather =Weather;
allConstructor.trails =Trails;
allConstructor.movies =Movies;
allConstructor.yelp =Yelp;

module.exports = allConstructor;