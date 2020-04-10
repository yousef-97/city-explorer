'use strict';

//dotenv (to read our enviroment varisble)
require('dotenv').config();

const superagent = require('superagent');

///to use constructors file
let toUseYelpConstructor = require('./construtors.js');


///////yelp////
function theYelp(request, response) {
    getYelp(request.query)
        .then(yelpData => response.status(200).send(yelpData))
        .catch(error => { errorHandler(error, request, response); })

}

function getYelp(yelpQuery) {
    const url = `https://api.yelp.com/v3/businesses/search?location=${yelpQuery.search_query}`


    return superagent.get(url)
        .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`)
        .then(data => {
            // console.log(data.body);
            let yelpPath = data.body.businesses;
            return yelpPath.map(yelp => {
                return new toUseYelpConstructor.yelp(yelp)
            })
        })

}


function errorHandler(error, request, response) {
    response.status(500).send(error);
}


///for expoting
module.exports = theYelp;