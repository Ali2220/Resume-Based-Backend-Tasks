const mongoose = require('mongoose')

async function connectDB(){
    await mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(`MongoDB Connection Error: ${err}`))
}

module.exports = connectDB