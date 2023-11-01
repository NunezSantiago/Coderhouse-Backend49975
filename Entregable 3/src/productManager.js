const express = require('express')
const fs = require('fs')

//Definicion de productManager

class productManager{

    constructor(path){
        this.path = path
    }

    async getProducts(){
        if(fs.existsSync(this.path)){
            return JSON.parse(await fs.promises.readFile(this.path, "utf-8"))
        }
        else{
            return []
        }
    }

    async addProducts(newProduct){
        //getProducts -> Add product -> Stringify
        let products = await this.getProducts()

        let existing = products.some((product) => product.code == newProduct.code)
        
        newProduct.id = products.length == 0 ? 1 : products[products.length - 1].id + 1

        if(!existing){
            products.push(newProduct)
            await fs.promises.writeFile(this.path, JSON.stringify(products))
        } else{
            console.log(`Already exisiting product with code  ${newProduct.code}`);
        }
    }

    async getProductByID(id){
        let products = await this.getProducts()
        let elem = products.find((product) => product.id === id)
        if(elem){
            return elem
        }
        else{
            console.log(`Not found element with ID ${id}`)
        }
    }

    async updateProduct(id, key, value){
        let products = await this.getProducts()

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

            await fs.promises.writeFile(this.path, JSON.stringify(products))
        } else{
            console.log(`Not found element with ID ${id}`)
        }
    }

    async deleteProduct(id){
        let products = await this.getProducts()

        let i = products.findIndex((product) => product.id === id)

        if(i != -1){
            products.splice(i, 1)
            await fs.promises.writeFile(this.path, JSON.stringify(products))
        } else{
            console.log(`Not found element with ID ${id}`)
        }
    }
}

module.exports = productManager