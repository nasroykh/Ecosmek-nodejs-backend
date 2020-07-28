/**   Downloaded NPM   **/
const express = require('express')
const multer  = require('multer')

/**   Local NPM   **/
const ProductsF = require('../functions/product')
const authentication = require('../middleware/auth');
const Account = require('../models/account');

/**   Variables   **/
/**
 * Used to upload pictures
 * {dest: 'images' ---> folder where we gonna stock pictures}
 * {storage: 'multer.memoryStorage()' ---> I am not sure but I used it so I can access image buffer}
 */
const upload = multer({dest: 'images', storage: multer.memoryStorage()});

/**************************/
/**   Express Routers   **/
/************************/
const router = new express.Router()

/**   Upload pictures for products   **/
router.post('/upload', upload.single('photo'), async (req, res) => {
    if(req.file) {

        console.log(req.file);
        res.json(req.file);
    }
    else throw 'error';
});



/**   Find products by key   **/
router.post('/find_products_by_key', async function (req, res, next) {
    console.log(req.body);
    const products = await ProductsF._get_products_by_key(req.body.key, req.body.value);
    res.send(products);
})

/**   Find products by words   **/
router.post('/find_products_by_words', async function (req, res, next) {
    try{
        const products = await ProductsF._get_products_by_words(req.body.wordskey);
        res.send(products);
    } catch (error) {
        console.log(error);
    }
})

router.get("/products", async function(req, res, next) {
    console.log(req.body);
    const products = await ProductsF._get_all_products();
    res.send(products);
});

/*-----------------   MANAGER   -----------------*/

/**   Create a new Product   **/
router.post('/create_new_product', [authentication.auth, authentication._admin_auth], upload.single('productPicture'), async function (req, res, next) {
    try {
        if (req.body.description === undefined) {
            req.body.description = "";
        }
        const creationStatue = await ProductsF._create_new_product(req.body.name, req.body.brand, req.body.price, req.body.category, req.file.buffer, req.body.type, req.body.description)
        if (creationStatue === 'Error') {
            res.send('Error during the creation of the product')
        } else if (creationStatue === 'Saved'){
            res.send('Product Created');
        }
    } catch (error) {
        res.send(error)
    }
})

/**   Buy a Product   **/
router.post('/buy_product', authentication.auth, async function (req, res, next) {

    const x = await ProductsF._buy_product(req.body._id, req.account._id)
    res.send("buy product")
})

/**   Edit a Product   **/
router.post('/edit_product', [authentication.auth, authentication._admin_auth], upload.single('productPicture'), async function (req, res, next) {
    console.log(req.body);
    const x = await ProductsF._edit_product(req.body._id, req.body.name, req.body.brand, req.body.price,
        req.body.category, req.body.type, req.body.description, req.body.img)
    res.send("products")
})

/**   Delete a Product   **/
router.post('/delete_product', [authentication.auth, authentication._admin_auth], async function (req, res, next) {
    console.log(req.body);
    const x = await ProductsF._delete_product(req.body._id)
    res.send("product deleted")
})





/**********************/
/**   EXPORT AREA   **/
/********************/
module.exports = router
