const express = require('express');
const connectDB = require('./config/db')

const app = express()

connectDB()

app.get('/', (req, res) => {
    res.send('checked')
})

app.listen(3000, () => {
    console.log('Server started at port 3000');
    
})