const express = require('express')
const axios = require('axios')
const nodemailer = require('nodemailer')
const Yup = require('yup')

const app = express();
app.use(express.json())

const users = []

app.get('/rate', (req, res) => {
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

app.get('/sendEmails', async (req, res) => {
    if(users.length > 0) {
        const currentPrice = await axios.get('https://blockchain.info/ticker')
        
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: '37yaroslav@gmail.com',
                pass: 'xaczvrexkyuvleia'
            }
        });

        let info = await transporter.sendMail({
            from: '"BTC Price Scanner" <37yaroslav@gmail.com', // sender address
            to: users.join(', '), // list of receivers
            subject: "BTC Price Rate ✔", // Subject line
            text: `Currenct BTC price: $ ${currentPrice.data.USD.last}`, // plain text body
            html: `<span>Currenct BTC price: $ ${currentPrice.data.USD.last}</span>`, // html body
        });

        transporter.sendMail(info, function(error, info){
            if (error) {
                res.status(400).send(error)
            } else {
                res.status(200).send('Email successfully sent to all subscribed users')
            }
        });
    } else {
        res.status(400).send('No users are subscribed to the api 😔')
    }
})

app.listen(3000, () => {
    console.log('Listening on port 3000...')
})