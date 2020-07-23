/**   Downloaded NPM   **/
const express = require('express');
const cors = require('cors');


/**   Variables   **/
const app = express();
app.use(cors());

/**   Local NPM   **/
require('./database/mongoose')
const accountRouter = require('./routers/account')
const productRouter = require('./routers/product')

/**   express uses   **/
app.use(express.json())
app.use(accountRouter)
app.use(productRouter)

/**   express functions   **/
app.listen(5000, () => {
    console.log("Server up on 5000");
})


