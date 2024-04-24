const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    }

})
const notes_schema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },

    title: {
        type: String,
        required: true,
    },
    notes: {
        type: String,
        required: true,
    }

})

const User = mongoose.model('users',userSchema)
const usernotes = mongoose.model('usernotes',notes_schema)
module.exports = {User, usernotes}