const fs = require('fs')

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
let a = "./productos.json"

let pm = new productManager(a)

let p1 = {
    title: "Producto prueba",
    description: "Esto es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25
}

let p2 = {
    title: "Producto prueba 2",
    description: "Esto es otro producto prueba",
    price: 400,
    thumbnail: "Sin imagen",
    code: "abc1234",
    stock: 50
}

let p3 = {
    title: "Producto prueba 3",
    description: "Este producto no podra ser insertado puesto que tiene el mismo codigo que el anterior",
    price: 400,
    thumbnail: "Sin imagen",
    code: "abc1234",
    stock: 50
}

pm.addProducts(p1)
pm.addProducts(p2)
pm.addProducts(p3)

console.log(pm.getProducts())

//Se intenta buscar un elemento existente
console.log(pm.getProductByID(1))

//Se intenta buscar un elemento que no existe
console.log(pm.getProductByID(3))

//Se intenta cambiar el titulo de un elemento existente
pm.updateProduct(1, "title", "Producto nuevo")

//Se intenta cambiar una clave no existente de un elemento existente
pm.updateProduct(2, "test", "Producto nuevo")

//Se intenta cambiar una clave de un producto no existente
pm.updateProduct(3, "title", "Producto nuevo")

console.log(pm.getProductByID(1))

//Se intenta eliminar un producto existente
pm.deleteProduct(1)

console.log(pm.getProducts())

//Se intenta volver a eliminar el mismo elemento que fue eliminado anteriormente
pm.deleteProduct(1)

console.log(pm.getProducts())