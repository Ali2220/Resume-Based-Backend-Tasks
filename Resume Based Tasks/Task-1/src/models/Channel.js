const mongoose = require('mongoose')

const ChannelSchema = new mongoose.Schema({
    name: String,
    workspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WorkSpace',
        index: true
    }
}, {timestamps: true})

module.exports = mongoose.model('Channel', ChannelSchema)