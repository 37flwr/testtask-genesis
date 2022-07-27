// import express from 'express';
const express = require('express')
const axios = require('axios')
const nodemailer = require('nodemailer')
// import axios from 'axios';

const app = express();

app.use(express.json())

app.get('/price', (req, res) => {
    axios.get('https://blockchain.info/ticker')
        .then((response) => {
            res.send(response.data.USD)
        })
})

app.get('/subscribe/:email', (req, res) => {
    res.send(req.params.email)
})

app.listen(3000, () => {
    console.log('Listening on port 3000...')
})