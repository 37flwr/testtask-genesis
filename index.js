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
    const alreadyRegistered = users.includes(req.params.email)

    if(checkForValidity && !alreadyRegistered) {
        users.push(req.params.email)
        res.send(`${req.params.email} successfully subscribed to mailing`)
    } else if(alreadyRegistered) {
        res.status(400).send(`User with email ${req.params.email} is already subscribed to mailing`)
    } else {
        res.status(400).send('Email is not valid. Try passing a valid email which might look like youremail@mail.com')
    }
})

app.get('/mailing', (req, res) => {
    console.log(users.join(', '))
    res.send(users)


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

app.listen(3000, () => {
    console.log('Listening on port 3000...')
})