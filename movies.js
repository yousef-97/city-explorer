'use strict';

//dotenv (to read our enviroment varisble)
require('dotenv').config();

const superagent = require('superagent');

///to use constructors file
let toUseMoviesConstructor = require('./construtors.js');


////////moveis/////
function theMovies(request, response) {
    getMovie(request.query)
        .then(movieData => response.status(200).send(movieData))
        .catch(error => {
            errorHandler(error, request, response);
        })

}


function getMovie(movieQuery) {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIES_API_KEY}&query=${movieQuery.search_query}`;

    return superagent.get(url)
        .then(data => {
            return data.body.results.map(movie => {
                return new toUseMoviesConstructor.movies(movie);
            })
        })

}




function errorHandler(error, request, response) {
    response.status(500).send(error);
}
///for expoting
module.exports = theMovies;