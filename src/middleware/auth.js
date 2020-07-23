const jwt = require('jsonwebtoken')
const Account = require('../models/account')
const bcrypt = require('bcryptjs')

/**   Variables   **/
const admin = {
    email: 'nasroemail',
    fullName: 'Nasro',
    password: 'NasroPassword',
}

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'HashageTokenCode')
        const account = await Account.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!account) {
            throw new Error()
        }

        req.account = account
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

const _admin_auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'HashageTokenCode')
        const account = await Account.findOne({ _id: decoded._id, 'tokens.token': token })

        console.log('email: ', account.email);
        console.log('fullName: ', account.fullName);
        console.log('password: ', account.password);
        const passwordMatch = await bcrypt.compare(admin.password, account.password)
        console.log(passwordMatch);

        if (account){
            if (account.email === admin.email && account.fullName === admin.fullName && passwordMatch) {
                next()
            } else {
                throw new Error()
            }
        } else {
            throw new Error()
        }

    } catch (e) {
        res.status(401).send({ error: 'You do not have acces to this page.' })
    }
}

module.exports.auth = auth
module.exports._admin_auth = _admin_auth