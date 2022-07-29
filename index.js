const express = require('express')
const axios = require('axios')
const Yup = require('yup')
const nodemailer = require('nodemailer')
const fs = require('fs')

const app = express();
const router = express.Router();

router
.route('/rate')
.get((req, res) => {
    axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=uah')
        .then((response) => {
            res.status(200).json(response.data.bitcoin.uah)
        }).catch((error) => {
            res.status(400).send('Invalid status value ' + error)
        })
})

router
.route('/subscribe')
.post(async (req, res) => {
    if(!fs.readFileSync('users.txt', 'utf-8').split('\n').slice(0, -1).includes(req.body.email)) {
        if(req.body?.email) {
            const schema = Yup.object().shape({
                email: Yup.string().email(),
            });
            const checkForValidity = await schema.isValid({email: req.body.email})
            if(checkForValidity) {
                fs.appendFileSync('users.txt', `${req.body.email}\n`, 'utf-8')
                res.status(200).send(`E-mail додано`)
            } else {
                res.status(400).send('Е-mail не валідний. Спробуйте ввести e-mail за типом youremail@mail.com')
            }
        } else {
            res.status(400).send('Missing or insufficient parameters')
        } 
    } else {
        res.status(409).send(`Юзер ${req.body.email} вже є у базі даних`)
    }
})

router
.route('/subscribe:email')
.post(async (req, res) => {
    if(!fs.readFileSync('users.txt', 'utf-8').split('\n').slice(0, -1).includes(req.params.email)) {
        if(req.params.email) {
            const schema = Yup.object().shape({
                email: Yup.string().email(),
            });
            const checkForValidity = await schema.isValid({email: req.params.email})
            if(checkForValidity) {
                fs.appendFileSync('users.txt', `${req.params.email}\n`, 'utf-8')
                res.status(200).send(`E-mail додано`)
            } else {
                res.status(400).send('Е-mail не валідний. Спробуйте ввести e-mail за типом youremail@mail.com')
            }
        } else {
            res.status(400).send('Missing or insufficient parameters')
        } 
    } else {
        res.status(409).send(`Юзер ${req.params.email} вже є у базі даних`)
    }
})

router
.route('/sendEmails')
.post(async (req, res) => {
    if(fs.readFileSync('users.txt', 'utf-8').split('\n').slice(0, -1).length > 0) {
        const currentPrice = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=uah')
        
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: '37yaroslav@gmail.com',
                pass: 'xaczvrexkyuvleia'
            }
        });

        let info = await transporter.sendMail({
            from: '"BTC Price Scanner" <37yaroslav@gmail.com', // sender address
            to: fs.readFileSync('users.txt', 'utf-8').split('\n').slice(0, -1).join(', '), // list of receivers
            subject: "BTC Price Rate ✔", // Subject line
            text: `Currenct BTC price: ${currentPrice.data.bitcoin.uah} UAH`, // plain text body
            html: `<span>Currenct BTC price: ${currentPrice.data.bitcoin.uah} UAH</span>`, // html body
        });

        transporter.sendMail(info, function(error){
            if (error) {
                res.status(400).send(error)
            } else {
                res.status(200).send('E-mailʼи відправлено')
            }
        });
    } else {
        res.status(400).send('Нажаль немає підписаних юзерів 😔')
    }
})

app.use(express.json());
app.use('/api', router)

app.listen(3000, () => {
    console.log('Listening on port 3000...')
})