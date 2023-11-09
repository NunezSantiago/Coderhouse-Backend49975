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
            return true
        } else{
            console.log(`Already exisiting product with code  ${newProduct.code}`);
            return false
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

    async updateProduct(id, parameters){
        let products = await this.getProducts()

        let i = products.findIndex((product) => product.id == id)

        let keys = Object.keys(parameters)

        let updateable = ['title', 'description', 'price', 'thumbnails', 'code', 'stock', 'category', 'status']
        
        if(i != -1){
        for(let key of keys){
            
                key = key.toLowerCase()
                let availableKey = updateable.includes(key)
                if(availableKey){
                    switch(key){
                        case 'title':
                            products[i].title = parameters[key]
                        break;
                        case 'description':
                            products[i].description = parameters[key]
                        break;
                        case 'price':
                            products[i].price = parameters[key]
                        break;
                        case 'thumbnail':
                            products[i].thumbnail = parameters[key]
                        break;
                        case 'code':
                            let existing = products.some((product) => product.code == parameters[key])
                            if(!existing){
                                products[i].code = parameters[key]
                            } else{
                                console.log(`Already exisiting product with code  ${parameters[key]}`);
                            }
                        break;
                        case 'stock':
                            products[i].stock = parameters[key]
                        break;
                        case 'category':
                            products[i].category = parameters[key]
                        break;
                        case 'status':
                            products[i].stock = parameters[key]
                        break;
                        default:
                            console.log(`${parameters[key]} is not defined`)
                    }
                } else{
                    console.log(`The key: ${parameters[key]} cannot be updated`)
                }
        }
                await fs.promises.writeFile(this.path, JSON.stringify(products))
            } else{ //if
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