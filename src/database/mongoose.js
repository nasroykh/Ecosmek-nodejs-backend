const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://aissaelkebch:elkebch@cluster0-wqtyq.mongodb.net/ecosmek?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})