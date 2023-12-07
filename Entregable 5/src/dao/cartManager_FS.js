import fs from 'fs'
import productManager from '../dao/productManager_FS.js'

let pm = new productManager("./files/productos.json")

class cartManager{

    constructor(path) {
        this.path = path
    }

    async getCarts(){
        if(fs.existsSync(this.path)){
            return JSON.parse(await fs.promises.readFile(this.path, "utf-8"))
        }
        else{
            return []
        }
    }

    async getCartbyID(cartID){
        let carts = await this.getCarts()

        let cart = carts.find((cart) => cart.id === cartID)

        if(!cart){
            console.log(`Not found cart with ID ${cartID}`)
        }else{
            return cart
        }
    }

    async addCart(products){
        let carts = await this.getCarts()

        let id = carts.length == 0 ? 1 : carts[carts.length - 1].id + 1

        let cart = {id: id, products:[]}

        for(let product of products){
            let elem = await pm.getProductByID(product)
            if(elem){
                cart.products.push({product: product, quantity:1})
            }
            else{
                console.log(`Product with id ${product} not found, therefore, not adding to cart`)
            }
        }
        carts.push(cart)
        await fs.promises.writeFile(this.path, JSON.stringify(carts))
    }

    async addProductToCart(cid, pid){
        let carts = await this.getCarts()

        let indexOfCart = carts.findIndex((c) => c.id === cid)

        let existing = await pm.getProductByID(pid)
        
        if(existing){
            if(indexOfCart != -1){
                let indexOfProduct = carts[indexOfCart].products.findIndex((prod) => prod.product == pid)
                if(indexOfProduct != -1){
                    carts[indexOfCart].products[indexOfProduct].quantity++
                } else{
                    carts[indexOfCart].products.push({product:pid, quantity:1})
                }
                await fs.promises.writeFile(this.path, JSON.stringify(carts))
                return true
            }
            else{
                console.log(`Cart with id ${cid} does not exist`)
                return {error: `Cart with id ${cid} does not exist`}
            }
        } else{
            console.log(`Product with id ${pid} does not exist`)
            return {error: `Product with id ${pid} does not exist`}
        }
    }

}

export default cartManager

/*

Testing cartManager

const env = async () => {
    let cm = new cartManager(""../files/carrito.json"")

    await cm.addCart([{id: 5}, {id: 9}, {id: 68}])

    let c = await cm.getCarts()
    for (let cart of c){
        console.log(`${cart.id} - ${cart.products[1].quantity}`)
    }

    await cm.addProductToCart(3, 56)
}

env()
*/