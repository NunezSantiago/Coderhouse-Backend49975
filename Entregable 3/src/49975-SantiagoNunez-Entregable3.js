const productManager = require("./productManager")
const express = require('express')

const PORT = 8080
const app = express()

let path = "./productos.json"
let pm = new productManager(path)


    app.get('/products', async (req, res) => {
        
        let products = await pm.getProducts()

        let limit = req.query.limit
    
        if(limit == '' || limit == undefined || limit >= products.length){
            res.json({Productos:products})
        } else if(isNaN(limit)){
            res.json({error: `Limit is not a number`})
        } else if(parseInt(limit) < 0){
            res.json({error: `Limit cannot be negative`})
        }
        else{
            res.json({Productos:products.slice(0, parseInt(limit))})
        }
    })

    app.get('/products/:pid', async (req, res) => {

        let id = req.params.pid
        
        if(id == '' || id == undefined){
            throw new Error(`Please, specify a product`)
        } else if(isNaN(id)){
            res.json({error: `ID is not a number`})
        } else if(parseInt(id) < 0){
            res.json({error: `ID cannot be negative`})
        }
        else{
            let product = await pm.getProductByID(parseInt(id))
            if(product){
                res.send(product)
            } else{
                res.json({error: `Product with id ${id} not found`})
            }
        }
    
    })

    const server = app.listen(PORT, async ()=>{
        console.log('Server is online')
    })


