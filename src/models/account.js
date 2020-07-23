const mongoose = require('mongoose')
const validator = require('validator')
const Product = require('../models/product')

const Account = mongoose.model('Account', {
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 2,
        trim: true,
    },
    gender: {
        type: String,
        required: false,
        trim: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    productsBought: [{
        _id: {
            type: String,
            required: true
        }
    }],
    productsInBag: [{
        _id: {
            type: String,
            required: true
        }
    }]
})


module.exports = Account