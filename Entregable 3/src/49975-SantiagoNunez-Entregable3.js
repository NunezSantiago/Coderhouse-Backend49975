const express = require('express')
const fs = require('fs')

//Definicion de productManager

class productManager{

    constructor(path){
        this.path = path
    }

    getProducts(){
        if(fs.existsSync(this.path)){
            return JSON.parse(fs.readFileSync(this.path, "utf-8"))
        }
        else{
            return []
        }
    }

    addProducts(newProduct){
        //getProducts -> Add product -> Stringify
        let products = this.getProducts()

        let existing = products.some((product) => product.code == newProduct.code)
        
        newProduct.id = products.length == 0 ? 1 : products[products.length - 1].id + 1

        if(!existing){
            products.push(newProduct)
            fs.writeFileSync(this.path, JSON.stringify(products))
        } else{
            console.log(`Already exisiting product with code  ${newProduct.code}`);
        }
    }

    getProductByID(id){
        let products = this.getProducts()
        let elem = products.find((product) => product.id === id)
        if(elem){
            return elem
        }
        else{
            console.log(`Not found element with ID ${id}`)
        }
    }

    updateProduct(id, key, value){
        let products = this.getProducts()

        let i = products.findIndex((product) => product.id === id)

        if(i != -1){

            key = key.toLowerCase()

            switch(key){
                case 'title':
                    products[i].title = value
                break;
                case 'description':
                    products[i].description = value
                break;
                case 'price':
                    products[i].price = value
                break;
                case 'thumbnail':
                    products[i].thumbnail = value
                break;
                case 'code':
                    let existing = products.some((product) => product.code == value)
                    if(!existing){
                        products[i].code = value
                    } else{
                        console.log(`Already exisiting product with code  ${newProduct.code}`);
                    }
                break;
                case 'stock':
                    products[i].stock = value
                break;
                default:
                    console.log(`${key} is not defined`)
            }

            fs.writeFileSync(this.path, JSON.stringify(products))
        } else{
            console.log(`Not found element with ID ${id}`)
        }

        
        
    }

    deleteProduct(id){
        let products = this.getProducts()

        let i = products.findIndex((product) => product.id === id)

        if(i != -1){
            products.splice(i, 1)
            fs.writeFileSync(this.path, JSON.stringify(products))
        } else{
            console.log(`Not found element with ID ${id}`)
        }
    }
}

const PORT = 8080
const app = express()

let path = "./productos.json"
let pm = new productManager(path)
let products = pm.getProducts()

app.get('/products', (req, res) => {

    let limit = req.query.limit
    
    if(limit == '' || limit == undefined || limit >= products.length){
        res.send(products)
    } else if(isNaN(limit)){
        res.send('Limit is not a number')
    } else if(parseInt(limit) < 0){
        res.send('Limit cannot be negative')
    }
    else{
        res.send(products.slice(0, parseInt(limit)))
    }
 
    

    //console.log(pm.getProductByID(parseInt(limit)))

})

app.get('/products/:pid', (req, res) => {

    let id = req.params.pid
    
    if(id == '' || id == undefined){
        res.send('Please, specify a product')
    } else if(isNaN(id)){
        res.send('ID is not a number')
    } else if(parseInt(id) < 0){
        res.send('Limit cannot be negative')
    }
    else{
        let product = pm.getProductByID(parseInt(id))
        if(product){
            res.send(product)
        } else{
            res.send(`Product with id ${id} not found`)
        }
    }

})

const server = app.listen(PORT, ()=>{
    console.log('test')
})

