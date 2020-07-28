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
router.post('/login', async (req, res) => {
        
    try {
//      If the information provide match an account store the account and the generate token
        const { account, token } = await AccountsF._connect_with_existing_account(req.body.identification, req.body.password)
        
//      If the password is incorrect
        if (account === 'Incorrect password')
            res.send({title: 'Incorrect password', signedIn: false});
         

//      else if the information provided do not matches an account
        else if (account === undefined)
            res.send({title: 'Account not found', signedIn: false});


//      else if the information provided matches an account
        else { 
//          Store true if the account is an admin. Otherwise, store false
            const isAdmin = await AccountsF._is_admin(account)

//          If the account is an admin account
            if (isAdmin)
                res.send({title: 'Welcome ' + account.fullName + '. I hope you are good manager', signedIn: true, token: token});
                

//          If the account is not an admin account
            else 
                res.send({title: 'Welcome ' + account.fullName + '. I hope you apreciate our shop', signedIn: true, token: token, fullName: account.fullName});
            
        }

    } catch (error) {

        res.send({error: error})

    }



})


router.post('/create_account', async (req, res) => {
    try {

//      Check if the fullName is used
        const fullNameUsed = await AccountsF._is_fullName_already_used(req.body.fullName)

//      Check if the email is used
        const emailUsed = await AccountsF._is_email_already_used(req.body.email)

//      Check if the email is used
        const emptyInformation = '' || null || undefined

//      If their is no email provided
        if (req.body.email === emptyInformation) 
            res.send({title:'Email Empty', signedUp: false})
        
//      Else If their no fullName provided
        else if (req.body.fullName === emptyInformation) 
            res.send({title: 'fullName Empty', signedUp: false})
        
//      Else If their is no fullName && email provided
        else if (req.body.fullName === emptyInformation && req.body.email === emptyInformation)
            res.send({title: 'email && fullname Empty', signedUp: false})

//      Else If the email and fullname are not used
        else if (!emailUsed && !fullNameUsed){
//          Create a new customer profile in our Stripe account
            const stripeID = await payment.createCustomer( {email: req.body.email, fullName: req.body.fullName} )

//          Create a new account with information provided + his stripe customer ID
            await AccountsF._create_new_account(req.body.fullName, req.body.email, req.body.password, stripeID)

//          Send Back the response
            res.send({title: 'Account Created', signedUp: true})
        }

//      Else If the email and fullname are used
        else if (fullNameUsed && emailUsed)
            res.send({title: 'Full name and email are already used', signedUp: false})

//      Else If the email are used
        else if (emailUsed) 
            res.send({title: 'Email already used', signedUp: false})

//      Else If the fullname are used
        else if (fullNameUsed)
            res.send({title: 'Full name are already used', signedUp: false})

    } catch (error) {
//      Send back an error
        res.send({error: error});
    }
})

/**   Return all accounts   **/
router.get('/get_accounts', [authentication.auth, authentication._admin_auth], async function (req, res, next) {
    const x = await AccountsF._get_all_accounts();
    res.send(x);
})


/**********************/
/**   EXPORT AREA   **/
/********************/
module.exports = router
