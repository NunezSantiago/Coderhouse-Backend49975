const Router = require('express').Router
const cartManager = require("../dao/cartManager_FS.js");

const router = Router()
const cm = new cartManager(__dirname + "/files/carts.json");

router.post('/', async (req, res) => {

    res.setHeader("Content-Type", "application/json");

    let params = req.query

    if(params.products){
        let productsIds = params.products.map((product) => parseInt(product))
        //console.log(typeof productsIds[0])
        await cm.addCart(productsIds)
        res.status(200).json({status:`Success`, message:`Cart added successfully`})
    } else{
        res.status(404).json({error:`?`})
    }

})

router.get('/:cid', async (req, res) => {
    res.setHeader("Content-Type", "application/json");

    let id = req.params.cid

    if(id == '' || id == undefined){
        res.status(404).json({error: 'Please, specify a cart'})
    } else if(isNaN(id)){
        res.status(404).json({error: `ID is not a number`})
    } else if(parseInt(id) < 0){
        res.status(404).json({error: `ID cannot be negative`})
    }
    else{
        let cart = await cm.getCartbyID(parseInt(id))
        if(cart){
            res.status(200).send(cart)
        } else{
            res.status(404).json({error: `Cart with id ${id} not found`})
        }
    }
})

router.post('/:cid/product/:pid', async (req, res) => {
    
    res.setHeader("Content-Type", "application/json");

    let cartId = req.params.cid
    let productId = req.params.pid

    if(cartId == '' || cartId == undefined){
        res.status(404).json({error: 'Please, specify a cart'})
    } else if(productId == '' || productId == undefined){
        res.status(404).json({error: 'Please, specify a product'})
    } else if(isNaN(cartId) || isNaN(productId) ){
        res.status(404).json({error: `IDs are not a number. Please, make sure to enter the information in the correct format`})
    } else if(parseInt(cartId) < 0 || parseInt(productId) < 0 ){
        res.status(404).json({error: `ID cannot be negative. Please, make sure to enter non negative values`})
    } else{
        let result = await cm.addProductToCart(parseInt(cartId), parseInt(productId))
        if(result === true){
            res.status(200).json({status:'Success', message:`Product with ID ${productId} has been successfully added to cart with ID ${cartId}`})
        } else{
            res.status(404).json({error: result.error})
        }
    }
})

export default router