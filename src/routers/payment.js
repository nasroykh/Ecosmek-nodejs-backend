/**   Downloaded NPM   **/
const express = require('express')

/**   Local NPM   **/
const AccountsF = require('../functions/account');
const authentication = require('../middleware/auth');
const payment = require('../functions/payment')

/**   Variables   **/
const router = new express.Router()


/**************************/
/**   Express Routers   **/
/************************/





/***
 * This router need to receive information about the "payment infos" && "CARD ID (source)" && "CUSTOMER ID (customer)"
 * 
 * In this Format:
 * 
                    {
                    
                        "amount": "15055000",
                        "currency": "usd",
                        "description": "4 payment",
                        "source": "card_1H9WnyLEASmFIL4kpxIaNIJD", 
                        "customer": "cus_HiydV24CLEFMsS"

                    }

 * 
 */
router.post('/payment', async function (req, res) {
    try {

        const { status } = await payment.chargeCustomer( req.body )
        res.send(status)

    } catch (error) {
        console.log(error);
        res.send(error.raw.code)
    }
})

/***
 * This router need to receive information about the "Stripe Customer"
 * 
 * In this Format:
 * 
                    {
                        "stripeCustomer": 
                            {
                                "email": "aifsdsdsa@gmail.com",
                                "name": "Aissa"

                            }
                    }

 * 
 */
router.post('/CustomerProcedure', async function (req, res) {
    try {
        const status = await payment.customerProcess(req.body.stripeCustomer)
        res.send(status)

    } catch (error) {
        console.log(error);
        res.send(error.raw.code)
    }
})

/**
 * This router need to receive information about the "Stripe Card" && "Customer ID"
 * 
 * In this Format:
                    {
                        "stripeCard": {
                                "number": "2223003122003222",
                                "exp_month": 2,
                                "exp_year": 2024,
                                "cvc": 212

                        },

                        "customer": {
                            "ID": "cus_HiydV24CLEFMsS"
                        }
                    }
 */

router.post('/CardProcedure', async function (req, res) {

    try {
//      
        const status = await payment.cardProccess(req.body.stripeCard, req.body.customer.ID)
        
        res.send(status)

    } catch (error) {
        console.log(error);
        res.send(error.raw.code)
    }
})


router.x



/**********************/
/**   EXPORT AREA   **/
/********************/
module.exports = router