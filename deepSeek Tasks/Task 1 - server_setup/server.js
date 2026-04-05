require("dotenv").config()
const express = require('express')
const app = express()
const connectDB = require('./config/db')

connectDB()

app.get("/", (req, res) => {
    return res.json({
        message: 'Api is running'
    })
})

app.listen(5000, () => {
    console.log('Server is running on port 5000');
    
})