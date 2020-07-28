const mongoose = require('mongoose')
const validator = require('validator')

const Customer = mongoose.model('Customer', {
    name: {
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
    card: [{
        number: {
            type: String,
            required: false,
            trim: true
        },    productsBought: [{
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
        }],
        token: {
            type: String,
            required: false,
            trim: true
        }
    }],
    stripeID: {
        type: String,
        required: true,
        trim: true
    }
})


module.exports = Customer