const express = require('express')
const axios = require('axios')
const Yup = require('yup')
const nodemailer = require('nodemailer')

const app = express();
const router = express.Router();

const formData = []

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
    if(req.body.email) {
        const schema = Yup.object().shape({
            email: Yup.string().email(),
        });
        const checkForValidity = await schema.isValid({email: req.body.email})
        const alreadyRegistered = formData.includes(req.body.email)
        if(checkForValidity && !alreadyRegistered) {
            formData.push(req.body.email)
            res.status(200).send(`E-mail додано`)
        } else if(alreadyRegistered) {
            res.status(409).send(`Юзер ${req.body.email} вже є у базі даних`)
        } else {
            res.status(400).send('Е-mail не валідний. Спробуйте ввести e-mail за типом youremail@mail.com')
        }
    } else {
        res.send('Missing or insufficient parameters')
    }
})

router
.route('/subscribe:email')
.post(async (req, res) => {
    const schema = Yup.object().shape({
        email: Yup.string().email(),
    });
    const checkForValidity = await schema.isValid({email: req.params.email})
    const alreadyRegistered = formData.includes(req.params.email)

    if(checkForValidity && !alreadyRegistered) {
        formData.push(req.params.email)
        res.send(`E-mail додано`)
    } else if(alreadyRegistered) {
        res.status(409).send(`Юзер ${req.params.email} вже є у базі даних`)
    } else {
        res.status(400).send('Е-mail не валідний. Спробуйте ввести e-mail за типом youremail@mail.com')
    }
})

router
.route('/sendEmails')
.post(async (req, res) => {
    if(formData.length > 0) {
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
            to: formData.join(', '), // list of receivers
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

// app.get('/rate', (req, res) => {
//     axios.get('https://blockchain.info/ticker')
//         .then((response) => {
//             res.send(response.data.USD)
//         }).catch((error) => {
//             res.send('Упс... Щось пішло не так' + error)
//         })
// })

// app.post('/subscribe', async (req, res) => {
//     const schema = Yup.object().shape({
//         email: Yup.string().email(),
//     });
//     const checkForValidity = await schema.isValid({email: req.body.email})
//     const alreadyRegistered = formData.includes(req.body.email)
//     if(checkForValidity && !alreadyRegistered) {
//         formData.push(req.body.email)
//         res.send(`E-mail додано`)
//     } else if(alreadyRegistered) {
//         res.status(409).send(`Юзер ${req.body.email} вже є у базі даних`)
//     } else {
//         res.status(400).send('Е-mail не валідний. Спробуйте ввести e-mail за типом youremail@mail.com')
//     }
// })

// app.post('/subscribe/:email', async (req, res) => {
//     const schema = Yup.object().shape({
//         email: Yup.string().email(),
//     });
//     const checkForValidity = await schema.isValid({email: req.params.email})
//     const alreadyRegistered = formData.includes(req.params.email)

//     if(checkForValidity && !alreadyRegistered) {
//         formData.push(req.params.email)
//         res.send(`E-mail додано`)
//     } else if(alreadyRegistered) {
//         res.status(409).send(`Юзер ${req.params.email} вже є у базі даних`)
//     } else {
//         res.status(400).send('Е-mail не валідний. Спробуйте ввести e-mail за типом youremail@mail.com')
//     }
// })

// app.post('/sendEmails', async (req, res) => {
//     if(formData.length > 0) {
//         const currentPrice = await axios.get('https://blockchain.info/ticker')
        
//         var transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 user: '37yaroslav@gmail.com',
//                 pass: 'xaczvrexkyuvleia'
//             }
//         });

//         let info = await transporter.sendMail({
//             from: '"BTC Price Scanner" <37yaroslav@gmail.com', // sender address
//             to: formData.join(', '), // list of receivers
//             subject: "BTC Price Rate ✔", // Subject line
//             text: `Currenct BTC price: $ ${currentPrice.data.USD.last}`, // plain text body
//             html: `<span>Currenct BTC price: $ ${currentPrice.data.USD.last}</span>`, // html body
//         });

//         transporter.sendMail(info, function(error){
//             if (error) {
//                 res.status(400).send(error)
//             } else {
//                 res.status(200).send('E-mailʼи відправлено')
//             }
//         });
//     } else {
//         res.status(400).send('Нажаль немає підписаних юзерів 😔')
//     }
// })

app.use('/api', router)

app.listen(3000, () => {
    console.log('Listening on port 3000...')
})