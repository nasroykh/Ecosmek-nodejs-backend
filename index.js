/**   Downloaded NPM   **/
const express = require('express');
const cors = require('cors');

/**   Variables   **/
const app = express();
app.use(cors());

/**   Local NPM   **/
require('./src/database/mongoose')
const accountRouter = require('./src/routers/account')
const productRouter = require('./src/routers/product')
const paymentRouter = require('./src/routers/payment')

/**   express uses   **/
app.use(express.json())
app.use(accountRouter)
app.use(productRouter)
app.use(paymentRouter)

/**   express functions   **/
app.listen(5005, () => {
    console.log("Server up on 5005");
})


