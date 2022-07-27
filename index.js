const express = require('express')
const axios = require('axios')
const nodemailer = require('nodemailer')
const Yup = require('yup')

const app = express();
app.use(express.json())

const users = []

app.get('/price', (req, res) => {
    axios.get('https://blockchain.info/ticker')
        .then((response) => {
            res.send(response.data.USD)
        })
})

app.get('/subscribe/:email', async (req, res) => {
    const schema = Yup.object().shape({
        email: Yup.string().email(),
    });
    const checkForValidity = await schema.isValid({email: req.params.email})

    if(checkForValidity) {
        users.push(req.params.email)
        res.send(`${req.params.email} successfully subscribed to BTC price updates`)
    } else {
        res.status(400).send('Email is not valid. Try passing a valid email which might look like youremail@mail.com')
    }


    // var transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //         user: 'foramazononly37@gmail.com',
    //         pass: 'vb8m34as'
    //     }
    // });

    // var mailOptions = {
    //     from: 'foramazononly37@gmail.com',
    //     to: req.params.email,
    //     subject: 'BTC Price Update!',
    //     text: 'currenct price...!!!!!!!!!!!!!!!!!!!!!!!!'
    // };

    // transporter.sendMail(mailOptions, function(error, info){
    //     if (error) {
    //         console.log(error);
    //     } else {
    //         console.log('Email sent: ' + info.response);
    //     }
    // });
})

app.get('/mailing', (req, res) => {
    res.send(users)
})

app.listen(3000, () => {
    console.log('Listening on port 3000...')
})