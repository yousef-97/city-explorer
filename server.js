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
server.get('/',(req,res)=>{
    res.status(200).send('working baby');
})











///////////////////for th end ////////////////

//localhost:3000/anything
server.use('*',(req,res)=>{
    // '*' for all 
    res.status(404).send('NOT FOUND');
});

//for error
server.use((error,req,res)=>{
    res.status(500).send(error);
})
