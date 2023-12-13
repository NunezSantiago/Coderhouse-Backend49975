import { Router } from 'express';
import productManager from '../dao/productManager_MONGO.js'

const routerProducts = Router()
const pm = new productManager();

//Add limit cases conditioning
routerProducts.get('/', async(req, res) => {
    res.setHeader("Content-Type", "application/json");
        
    let {limit, page, query, sort} = req.query

    let products = await pm.getProducts(limit, page, query, sort)

    res.status(200).json({Products: products.docs})

    /*if(limit == '' || limit == undefined || limit >= products.length){
        res.status(200).json({Products: products.docs})
    } else if(isNaN(limit)){
        res.status(404).json({error: `Limit is not a number`})
    } else if(parseInt(limit) < 0){
        res.status(404).json({error: `Limit cannot be negative`})
    }
    else{
        res.status(200).json({Products: products.slice(0, parseInt(limit))})
    }*/
})

routerProducts.get('/:pid', async (req, res) =>{

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
        let product = await pm.getProductByID(id)

        if(!product || product.error){
            if(!product){
                res.status(404).json({error: `Product with id ${id} not found`})
            } else{
                res.status(500).json(product)
            }
        } else{
            res.status(200).send(product)
        }
    }

})

routerProducts.post('/', async (req, res) => {

    res.setHeader("Content-Type", "application/json");

    let params = req.query

    let complete = (params.title && params.description && params.code && params.price && params.stock && params.category) ? true : false

    if(!complete){
        res.status(400).json({error: 'Product information is not complete, please, make sure to enter all necessary information'})
    } else{
        if(isNaN(params.stock) || isNaN(params.price)){
            res.status(400).json({error: `${params.description}Product information is not correct, please, make sure to enter all information in the correct format`})
        } else{

            let product

            if(!params.status){
                product = {
                    title: params.title,
                    description: params.description,
                    price: params.price,
                    thumbnails: params.thumbnails,
                    code: params.code,
                    stock: params.stock,
                    category: params.category
                }
            } else{
                if(params.status != false || params.status != true){
                    res.status(400).json({error: `Status must be a boolean value. (True or False).`})
                } else{
                    let status
                    if(params.status == true){
                        status = true
                    } else {
                        status = false
                    }

                    product = {
                        title: params.title,
                        description: params.description,
                        price: params.price,
                        thumbnails: params.thumbnails,
                        code: params.code,
                        stock: params.stock,
                        category: params.category,
                        status: status
                    }
                }
            }
            

        let result = await pm.addProducts(product)

        if(!result || result.error){
            if(!result){
                res.status(400).json({error:`Already exisiting product with code ${params.code}`})
            } else{
                res.status(500).json(result)
            }
        } else{
            res.status(200).json({status:`Success`, message:`Product added successfully`})
        }
        

    }
}

})

routerProducts.put('/:pid', async (req, res) => {
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
        let result = await pm.updateProduct(id, params)
        
        if(!result.error){
            res.status(200).json({status:'success', message:`Product updated successfully`})
        } else{
            return res.status(404).json(result)
        }
        
    }
})

routerProducts.delete('/:pid', async (req, res) => {

    res.setHeader("Content-Type", "application/json")

    let id = req.params.pid

    if(id == '' || id == undefined){
        return res.status(404).json({error: `Please, specify a product`})
    } else if(isNaN(id)){
        return res.status(404).json({error: `ID is not a number`})
    } else if(parseInt(id) < 0){
        return res.status(404).json({error: `ID cannot be negative`})
    }
    else{
        let result = await pm.deleteProduct(parseInt(id))
        if(!result.error){
            res.status(200).json({status:'success', message:`Product updated successfully`})
        } else{
            return res.status(404).json(result)
        }
    }
})

export default routerProducts