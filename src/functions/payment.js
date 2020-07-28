const stripe = require('stripe')('sk_test_51H6wAyLEASmFIL4kUp0nqbXkBTLFbOdXztoVTvClo4bQ5gtmFSTonU7UlkXsUzSHGEjB4lE51cH5XXVlfhRFLLFm00gvTLtnCQ');
const Customer = require('../models/customer');
const { default: Stripe } = require('stripe');


/*******************/
/**   CUSTOMER   **/
/*****************/

/**
 * Return all customers
 */
const getCustomers = async () => {
    return customers = await stripe.customers.list()
}

/**
 * 
 * @param {*} ID 
 * Get a Stripe customer using his ID and return the customer
 */
const getCustomer_byID = async (ID) => {
    return customer = await stripe.customers.retrieve(ID)
}

/**
 * 
 * @param {*} email 
 * Get a Stripe customerID using his ID and return it (ID)
 */
const getCustomerID_byEmail = async (email) => {
//  Store all stripe customers
    const customers = await getCustomers();
    
//  Store the number of Stripe customers 
    const size = Object.size(customers['data'])

//  Loop through all customers
    for (i = 0; i < size; i++){

//      Check if some the email provided match a customer
        if (customers['data'][i]['email'].toLowerCase() === email)
//          Return the customer ID
            return { status: 'Success', stripeID: customers['data'][i]['id'] }
        
    }

//  Return ...
    return { status: 'Failure', stripeID: undefined }

}

/**
 * 
 * @param {*} stripeCustomer 
 * Create a new Stripe customer
 */
const createCustomer = async (stripeCustomer) => {
//  Create a new customer account in the stripe website
    const customer = await stripe.customers.create(stripeCustomer)

//  If the customer has been created correctly
    if (customer.object === 'customer')
//      Return success creation && the customer stripe ID
        return {status: 'Success', stripeID: customer.id}

}

/**
 * 
 * @param {*} stripeCustomer 
 * If the Stripe customer already exist "use it". Otherwise, create a new one
 */
const customerProcess = async (stripeCustomer) => {
//  Comment
    const customer = await getCustomerID_byEmail(stripeCustomer.email)

//  If their is Stripe customer using the same email
    if (customer.status === 'Success')
        return {status: 'Success', stripeID: customer.stripeID, more: "account already exist so no need to create it again"}
    

//  If their is NO Stripe customer using the same email
    else if (customer.status === 'Failure'){

//      Create a new customer
        const newCustomer = await createCustomer(stripeCustomer)

//      If the new customer has been created successfully
        if (newCustomer.status === 'Success')  
            return {status: 'Success', stripeID: newCustomer.stripeID}
            
    }

}






/***************/
/**   CARD   **/
/*************/

/**
 * 
 * @param {*} card 
 * Create a token for the Stripe card
 */
const createToken = async (card) => {
    return token = await stripe.tokens.create( { card } )
}

/**
 * 
 * @param {*} customerID 
 * @param {*} tokenID 
 * Add the Stripe card to a Stripe customer
 */
const addCard = async (customerID, tokenID) => {
    return card = await stripe.customers.createSource(customerID, { source: tokenID } )
}

/**
 * 
 * @param {*} customerID 
 * @param {*} fingerprint 
 * return true if the card is already assign to this customer. Otherwise, return false
 */
const _isAssign = async (customerID, fingerprint) => {

//  Store Stripe customer
    const customer = await stripe.customers.retrieve(customerID)

//  Loop through all cards fingerprints
    for (i = 0; i < customer.sources.data.length; i++) {

//      Return true if the provided fingerprint match one of the cards
        if (fingerprint === customer.sources.data[i].fingerprint){
            return true
        }
    }

    return false
}

/**
 * 
 * @param {*} customer 
 * @param {*} fingerprint 
 * Return a Stripe card ID
 */
const getCardID = async (customer, fingerprint) => {
//  Loop through all customer cards
    for (i = 0; i < customer.sources.data.length; ++i){

//      Return the cardID if the fingerprint provided match a fingerprint of a card that is stored in the Stipe customer
        if (customer.sources.data[i].fingerprint === fingerprint)
            return cardID = customer.sources.data[i].id
        
    }
}

/**
 * 
 * @param {*} card 
 * @param {*} customerID 
 * Use the card if it's not already assign to the customer. Otherwise add the card to the Stripe customer
 */
const cardProccess = async ( card, customerID ) => {

//  Store the creating token of the card 
    const token = await createToken(card)

//  Store true if the card is already assign with this Stripe customer
    const isAssign = await _isAssign(customerID, token.card.fingerprint)

//  If the card is NOT assign to the stripe customer received
    if (!isAssign) {

//      Assign the card to the Stripe customer
        await addCard( customerID, token.id )

//      Return the Stripe customer and the card ID
        return {customerID, cardID: token.card.id}

    }

//  If the card is assign to the stripe customer received
    else {

//      Store the {object: customer} (all info) using his ID
        const customer = await getCustomer_byID(customerID)
  
//      Store the ID of the card that is already assign to the Stripe customer
        const cardID = await getCardID(customer, token.card.fingerprint)

//      Return the Stripe customer and the card ID
        return {customerID, cardID}

    }

}






/******************/
/**   CHARGES   **/
/****************/

/**
 * 
 * @param {*} payment 
 * Charge the customer
 */
const chargeCustomer = async ( payment ) => {
    return await stripe.charges.create(payment)
}








/******************/
/**   EXPORTS   **/
/****************/
module.exports.chargeCustomer = chargeCustomer
module.exports.getCustomerID_byEmail = getCustomerID_byEmail
module.exports.customerProcess = customerProcess
module.exports.cardProccess = cardProccess








/********************/
/**   SECONDARY   **/
/******************/

/* Return the size of an object */
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};







