const mongoose = require('mongoose')

const workSpaceSchema = new mongoose.Schema({
    name: {
        type: String
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {timestamps: true})

module.exports = mongoose.model('WorkSpace', workSpaceSchema)