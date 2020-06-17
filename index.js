require('dotenv').config()
const express = require('express')
const nodemailer = require('nodemailer')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

let transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.MAIL_USR, 
    pass: process.env.MAIL_PWD, 
  },
})

transporter.verify((error, success) => {
  if (error) {
    console.log(error)
  } else {
    console.log('Transporter ready')
  }
})

app.post('/api/send', (req, res) => {
  console.log('data', req.body)
  const name = req.body.name
  const email = req.body.mail
  const msg = req.body.msg
  const content = `name: ${name} \n email: ${email} \n message: ${msg} `

  const mail = {
    from: `"${name}" <${email}>`,
    to: process.env.MAIL_USR, 
    subject: 'New Message from node-mailer',
    text: content
  }

  transporter.sendMail(mail, (error, data) => {
    if (error) {
      res.json({
        status: 'fail'
      })
    } else {
      res.json({
        status: 'success'
      })
      
    }
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
