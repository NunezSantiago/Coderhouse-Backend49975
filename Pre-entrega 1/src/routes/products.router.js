const Router = require('express').Router
const ProductManager = require("../productManager");

const router = Router()
const pm = new ProductManager("./files/productos.json");

router.get('/', async (req, res) => {

    res.setHeader("Content-Type", "application/json");
        
    let products = await pm.getProducts()

    let limit = req.query.limit

    if(limit == '' || limit == undefined || limit >= products.length){
        res.status(404).json({Productos:products})
    } else if(isNaN(limit)){
        res.status(404).json({error: `Limit is not a number`})
    } else if(parseInt(limit) < 0){
        res.status(404).json({error: `Limit cannot be negative`})
    }
    else{
        res.status(200).json({Productos:products.slice(0, parseInt(limit))})
    }
})

router.get('/:pid', async (req, res) => {

    res.setHeader("Content-Type", "application/json");

    let id = req.params.pid
    
    if(id == '' || id == undefined){
        res.status(404).json({error: 'Please, specify a product'})
    } else if(isNaN(id)){
        res.status(404).json({error: `ID is not a number`})
    } else if(parseInt(id) < 0){
        res.status(404).json({error: `ID cannot be negative`})
    }
    else{
        let product = await pm.getProductByID(parseInt(id))
        if(product){
            res.status(200).send(product)
        } else{
            res.status(404).json({error: `Product with id ${id} not found`})
        }
    }

})

router.delete('/:pid', async (req, res) => {

    res.setHeader("Content-Type", "application/json");

    let id = req.params.pid

    if(id == '' || id == undefined){
        return res.status(404).json({error: `Please, specify a product`})
    } else if(isNaN(id)){
        return res.status(404).json({error: `ID is not a number`})
    } else if(parseInt(id) < 0){
        return res.status(404).json({error: `ID cannot be negative`})
    }
    else{
        let product = await pm.getProductByID(parseInt(id))
        if(product){
            await pm.deleteProduct(parseInt(id))
            return res.status(200).json({status:'success', message:`Product with ID ${id} has been deleted`})
        } else{
            return res.status(404).json({error: `Product with id ${id} not found`})
        }
    }
})

router.post('/', async (req, res) => {

    res.setHeader("Content-Type", "application/json");

    let params = req.query

    let complete = (params.title && params.description && params.code && params.price && params.stock && params.category) ? true : false

    
    let status = !params.status ? 'true' : params.status //Status is true by default
    
    let thumbnail = !params.thumbnail ? [] : params.thumbnails
    //res.json({coso: status, complete: complete})

    if(!complete){
        res.status(400).json({error: 'Product information is not complete, please, make sure to enter all necessary information'})
    } else{
        if(isNaN(params.stock) || isNaN(params.price)){
            res.status(400).json({error: `${params.description}Product information is not correct, please, make sure to enter all information in the correct format`})
        } else if(status != 'true' && status != 'false'){
            res.status(400).json({error: `${status != 'true'} Status must be a boolean value. (True or False).`})
        } else{
            let product = {
                title: params.title,
                description: params.description,
                price: params.price,
                thumbnails: thumbnail,
                code: params.code,
                stock: params.stock,
                category: params.category,
                status: status,
            }

            let result = await pm.addProducts(product)

            if(result){
                res.status(200).json({status:`Success`, message:`Product added successfully`})
            } else{
                res.status(400).json({error:`Already exisiting product with code ${params.code}`})
            }

        }
    }
})

router.put('/:pid', async (req, res) => {
    res.setHeader("Content-Type", "application/json");

    let id = req.params.pid

    let params = req.query

    if(id == '' || id == undefined){
        return res.status(404).json({error: `Please, specify a product`})
    } else if(isNaN(id)){
        return res.status(404).json({error: `ID is not a number`})
    } else if(parseInt(id) < 0){
        return res.status(404).json({error: `ID cannot be negative`})
    }
    else{
        await pm.updateProduct(id, params)
        res.status(200).json({status:'success', message:`Product updated successfully`})
    }
})

module.exports = router