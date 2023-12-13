import { Router } from 'express';
import cartManager from '../dao/cartManager_MONGO.js';
import { router } from './views.router.js';

const routerCarts = Router()
const cm = new cartManager();

routerCarts.get('/', async(req, res) => {

    res.setHeader("Content-Type", "application/json");
    let carts = await cm.getCarts()
    res.status(200).json({Carts: carts})

})

routerCarts.get('/:cid', async (req, res) => {

    res.setHeader("Content-Type", "application/json")
    let id = req.params.cid

    if(id == '' || id == undefined){
        res.status(404).json({error: 'Please, specify a cart'})
    } else if(isNaN(id)){
        res.status(404).json({error: `ID is not a number`})
    } else if(parseInt(id) < 0){
        res.status(404).json({error: `ID cannot be negative`})
    } else{
        let result = await cm.getCartByID(parseInt(id))
        if(result && !result.status){
            res.status(200).send(result)
        } else{
            res.status(404).json(result)
        }
    }
})

routerCarts.post('/', async (req, res) => {
    res.setHeader("Content-Type", "application/json")
    let params = req.query
    let products = params.products

    if(Array.isArray(products)){
        let str = false
        for(let p of products){
            if(isNaN(p)){
                str=true
                break
            }
        }
        if(str){
            res.status(404).json({status:'failed', error:"Please, make sure that all values are numbers"})
        } else{
            let result = await cm.addCart(params.products)

            if(!result.error){
                res.status(200).json({status:`Success`, message:`Cart added successfully`})
            } else{
                res.status(400).json(result)
            }
        }
    } else if(isNaN(products)){
        res.status(404).json({status:'failed', error:"Please, make sure that all values are numbers"})
    } else{
        let result = await cm.addCart(params.products)

        if(!result.error){
            res.status(200).json({status:`Success`, message:`Cart added successfully`})
        } else{
            res.status(400).json(result)
        }
    }

})

routerCarts.post('/:cid/product/:pid', async (req, res) => {
    res.setHeader("Content-Type", "application/json");

    let cartId = req.params.cid
    let productId = req.params.pid

    let {quantity} = req.query

    if(cartId == '' || cartId == undefined){
        res.status(404).json({error: 'Please, specify a cart'})
    } else if(productId == '' || productId == undefined){
        res.status(404).json({error: 'Please, specify a product'})
    } else if(isNaN(cartId) || isNaN(productId) ){
        res.status(404).json({error: `IDs are not a number. Please, make sure to enter the information in the correct format`})
    } else if(parseInt(cartId) < 0 || parseInt(productId) < 0 ){
        res.status(404).json({error: `ID cannot be negative. Please, make sure to enter non negative values`})
    } else{
        let result = await cm.addProductToCart(parseInt(cartId), parseInt(productId), quantity ? parseInt(quantity) : 1)
        if(result === true){
            res.status(200).json({status:'Success', message:`Product with ID ${productId} has been successfully added to cart with ID ${cartId}`})
        } else{
            res.status(404).json({error: result.error})
        }
    }
})

routerCarts.delete('/:cid/product/:pid', async (req, res) => {
    res.setHeader("Content-Type", "application/json");

    let cartId = req.params.cid
    let productId = req.params.pid

    let result = await cm.removeFromCart(parseInt(cartId), parseInt(productId))

    console.log(result)

})


export default routerCarts