const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://nasykh:IpfrOTHm9xcUie2S@cluster0-wqtyq.mongodb.net/ecosmek?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});
