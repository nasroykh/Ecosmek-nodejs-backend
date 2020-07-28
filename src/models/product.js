const mongoose = require('mongoose')
const validator = require('validator')
//comment
const Product = mongoose.model('Product', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    brand: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        minlength: 2,
        trim: true,
    },
    category: {
        type: String,
        require: true,
        minlength: 2,
        trim: true
    },
    type: {
        type: String,
        require: true,
        minlength: 2,
        trim: true
    },
    description: {
        type: String,
        require: false,
        minlength: 2,
        trim: true
    }, 
    img: {
        require: true,
        type: Buffer, 
    }
    
})

Product.find({}).lean().exec(function(err, docs) {
});

module.exports = Product