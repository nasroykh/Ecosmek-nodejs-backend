/**   Downloaded NPM   **/
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const validator = require('validator')

/**   Local NPM   **/
const Account = require('../models/account')


/**   Variables   **/
const admin = {
    email: 'nasroemail',
    fullName: 'Nasro',
    password: 'NasroPassword',
}

/********************/
/**   Functions   **/
/******************/

/**
 * 
 * @param {*} fullName sender full name
 * @param {*} password sender password
 * @param {*} email sender email
 * 
 * This function use params received to create a new account
 */
const _create_new_account = async (fullName, email, password, stripeID) => {



    try {
//      LowerCase them so we can compare without a problem
        fullName = fullName.toLowerCase()
        email = email.toLowerCase()

//      We hash the password
        password = await bcrypt.hash(password, 8)

//      We create a new user with the new object created {account}
        const account = new Account( {fullName, email, password, stripeID} )

//      We save the new user in the database and catch an error if exist
        await account.save()

    } catch (error) {

        return 'Error'

    }
    
}

/**
 * 
 * @param {*} fullNameORemail 
 * @param {*} password 
 * 
 * This function check if the fullNameORemail and password match an account
 * && return the account if it matchs an account. Otherwise, return undefined value
 * @returns {fullName} 
 */
const _connect_with_existing_account = async (identification, password) => {

    try {

//      LowerCase them so we can compare without a problem
        identification = identification.toLowerCase()

//      Store the account find by {var: identification}
        let account = undefined

//      If {var: identification} is an Email form
        if (validator.isEmail(identification)){
            account = await Account.findOne({email: identification})

//      If {var: identification} is not an Email form (fullName Form)
        } else if (!validator.isEmail(identification)){
            account = await Account.findOne({fullName: identification})
        }
//      If account not found return an error message (String Format)
        if (account === null || account === undefined){
            return Promise.resolve( { account: undefined, token: undefined } )
        }
//      We compare the password received with the account password
        const passwordMatch = await bcrypt.compare(password, account.password)

//      If they match
        if (passwordMatch){
            
//          We generate a new token
            const token = await generateAuthToken(account._id)

//          We add the token to account.tokens
            account.tokens = account.tokens.concat({ token })

//          We update the account (adding a new token)
            await account.save()

//          We return the account
            return Promise.resolve( { account, token } )

        } else {

//          We return an Error            
            return Promise.resolve( { account: 'Incorrect password', token: undefined } )

        }
        
    } catch (error) {
        
        return 'Error'

    }
    
}

/**
 * 
 * @param {*} fullName 
 * This function return true if the fullname is used otherwise return false
 */
const _is_fullName_already_used = async (fullName) => {

    try {

//      LowerCase them so we can compare without a problem
        fullName = fullName.toLowerCase()

//      Get all accounts
        const account = await Account.findOne({ fullName })

//      return false if the fullname never been used by an account. Otherwise return true
        if (account) {
            return true
        } else {
            return false
        }

    } catch (error) {

        return 'Error'

    }
}

/**
 * 
 * @param {*} email
 * This function return true if the email is used otherwise return false
 */
const _is_email_already_used = async (email) => {
    try {

//      LowerCase them so we can compare without a problem
        email = email.toLowerCase()

//      Get all accounts
        const account = await Account.findOne({email: email})
        
//      return false if the fullname never been used by an account. Otherwise return true
        if (account) {
            return true;
        } else {
            return false
        }

    } catch (error) {

        return 'Error'

    }
}

/**
 * 
 * @param {*} id 
 * This function generate a token using account _id
 * && return the token
 */
const generateAuthToken = async function (id) {

    try {

//      Store a generated token using an _id
        const token = jwt.sign({ _id: id.toString() }, 'HashageTokenCode')

//      return the token
        return token

    } catch (error) {

        return 'Error'

    }

}


/**
 * 
 * @param {*} account
 * This function return true if the account provided is an admin account. Otherwise, return false 
 */
const _is_admin = async function (account) {
    
    try {

//      LowerCase them so we can compare without a problem
        account.fullName = account.fullName.toLowerCase()
        account.email = account.email.toLowerCase()
        
        admin.fullName = admin.fullName.toLowerCase()
        admin.email = admin.email.toLowerCase()
        console.log(admin);
        console.log(account);
//      Store true if the password received match the admin password. Otherwise, store false
        const passwordMatch = await bcrypt.compare(admin.password, account.password)

//      Check if information provided matches "admin" information
        if (account.email === admin.email && account.fullName === admin.fullName && passwordMatch) {

            //return true if it matches
            return true;

        } else {

            //return false if it doesn't match
            return false;

        }
    } catch (error) {

        return 'Error'

    }


}

/**
 * This function return all accounts
 */
const _get_all_accounts = async function () {

    try {

//      Store all accounts
        const accounts = Account.find({})

//      return accounts
        return Promise.resolve(accounts)

    } catch (error) {

        return 'Error'

    }

}


/* 
#######################
###   EXPORT AREA   ###
#######################
*/
module.exports._create_new_account = _create_new_account
module.exports._connect_with_existing_account = _connect_with_existing_account
module.exports._is_fullName_already_used = _is_fullName_already_used
module.exports._is_email_already_used = _is_email_already_used
module.exports._is_admin = _is_admin
module.exports._get_all_accounts = _get_all_accounts
