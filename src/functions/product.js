/**   Downloaded NPM   **/
    // Empty

/**   Local NPM   **/
const Product = require('../models/product')
const Account = require('../models/account')

/**   Variables   **/
    // Empty



/********************/
/**   Functions   **/
/******************/

/**
 * 
 * @param {*} name 
 * @param {*} model 
 * @param {*} price 
 * @param {*} description 
 * 
 * This function will add a new product to the database
 */
const _create_new_product = async (name, brand, price, category, img, type) => {

    try {

//      We create a new product using information received
        const product = new Product({name, brand, price, category, img, type})

//      We save the new product in the database and catch an error if exist
        await product.save()

        return 'Saved'

    } catch (error) {

        return 'Error'

    }

}

/**
 * 
 * @param {*} wordsKey 
 * This function return all products that contain the search {String: wordsKey}
 */
const _get_products_by_words = async (wordsKey) => {

    try{
//      Get all products
        const products = await _get_all_products()

//      Store wanted products
        let specificProducts = new Array()
    
//      Loop inside {Array: products}
        for (i = 0; i < products.length; i++){
//          Loop inside {Object: products[i]}
            for (key in products[i]){
       
//              If the wordskey match any product attributes
                if (products[i][key].toString().includes(wordsKey)){

//                  Add the wanted product in {Array: specificProducts}
                    specificProducts.push(products[i])
                    
                }
            }
    
        }
    
        return Promise.resolve(specificProducts)

    } catch (error) {

        return 'Error'

    }

}

/**
 * 
 * @param {*} key 
 * @param {*} value 
 * This function return products that match the value of the key
 * if key == brand && value == Adidas {return products that belong to adidas brand}
 */
const _get_products_by_key = async (key, value) => {

    try {

//      Get the wanted products 
        const specificProducts = await Product.findOne({[key]: [value]})
        console.log(specificProducts);

//      Return them
        return Promise.resolve(specificProducts)

    } catch (error) {

        return 'Error'

    }

}

/**
 * This function return all products
 */
const _get_all_products = async () => {

    try {

//      Store all products
        const products = await Product.find({}).lean()

        return Promise.resolve(products)

    } catch (error) {

        return 'Error'

    }


}


/**
 * 
 * @param {*} _id 
 * @param {*} name 
 * @param {*} brand 
 * @param {*} price 
 * @param {*} category 
 * @param {*} type 
 * @param {*} description 
 * @param {*} img 
 * Edit a product and update it in the database
 */
const _edit_product = async (_id, name, brand, price, category, type, description, img) => {

    try {

//      Store the wanted product
        const product = await Product.findOne({ _id })
        
//      Update the information of the wanted product        
        product["name"] = name
        product["brand"] = brand
        product["price"] = price
        product["category"] = category
        product["type"] = type
        product["description"] = description
        product["img"] = img

//      Save the product with the updated information
        await product.save()


    } catch (error) {
        
        return 'Error'

    }

}


/**
 * 
 * @param {*} _id 
 * Delete a product by his id
 */
const _delete_product = async (_id) => {

    try {

//      Delete the wanted product by his _id
        await Product.deleteOne({ _id })

    } catch (error) {

        return 'Error'

    }

}

/**
 * 
 * @param {*} productID 
 * @param {*} buyerID 
 * Add a product to an productBough of the buyer account
 */
const _buy_product = async (productID, buyerID) => {

    try {
//      Find the wanted product by his _id
        const product = await Product.findOne({ _id: productID })

//      Find the buyer by his _id
        const buyer = await Account.findOne({ _id: buyerID })

//      Add the wanted product to the "productsBought" of the buyer
        buyer["productsBought"].push(product._id)

//      Save the buyer with the new information
        buyer.save()

    } catch (error) {

        return 'Error'

    }
}



/* 
#######################
###   EXPORT AREA   ###
#######################
*/
module.exports._create_new_product = _create_new_product
module.exports._get_products_by_words = _get_products_by_words
module.exports._get_products_by_key = _get_products_by_key
module.exports._edit_product = _edit_product
module.exports._get_all_products = _get_all_products
module.exports._delete_product = _delete_product
module.exports._buy_product = _buy_product












/**
 * 
 * @param {*} products 
 * This function receive an products array will full information (including _id and version)
 * && return an array of object with only wanted information (without _id and version)
 */
const _limit_products_data = async (products) => {
    try {

//      Store products received in this array but only with the wanted data
        const productsLimitedData = new Array()

//      Loop inside products received
        for (i = 0; i < products.length; ++i){

//          Create a product with only necessary data
            const product = {
                name: products[i].name,
                model: products[i].model,
                price: products[i].price,
                description: products[i].description
            }

//          Add product with only wanted data to {array: productsLimitedData}
            productsLimitedData.push(product)
        }

        return Promise.resolve(productsLimitedData)

    } catch (error) {
        console.log(error);
    }

}