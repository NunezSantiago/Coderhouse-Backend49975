import { cartsModel } from "../models/carts.model.js";
import { productsModel } from "../models/products.model.js";
import productManager from "./productManager_MONGO.js";

let pm = new productManager()

class cartManager{

    async getCarts(){
        let carts = []

        try {
            carts = cartsModel.find({isDeleted : false})
        } catch (error) {
            console.log(error.message)
        }

        return carts
    }

    async getCartByID(cid){
        let cart

        try {
            cart = await cartsModel.findOne({id: cid, isDeleted: false})
        } catch (error) {
            return {status: 'failed', error: error.message}
        }
        
        if(!cart){
            return {status: 'success', message: `Could not find cart with ID ${cid}`}
        }else{
            return cart
        }
    }

    async addCart(products){

        let id

		try {
			id = await cartsModel.find().sort({id:-1}).limit(1)
			id = id[0] ? id[0].id + 1 : 1
		} catch (error) {
			return {error: 'Error inesperado', message: error.message}
		} 

        let productsInCart = []

        let availableProducts = await productsModel.find({id: {'$in': products}, isDeleted: false})

        if(availableProducts){
            availableProducts.forEach(elem => {
            productsInCart.push({product: elem.id, quantity: 1})
        })
        } else{
            return {status: 'failed', error: "Could not find products with provided ids"}
        }
        
        try {
            await cartsModel.create({id: id, products: productsInCart})
            return true
        } catch (error) {
            return {error: 'Error inesperado', message: error.message}
        }
    }

    async addProductToCart(cid, pid){

        let cart = await this.getCartByID(cid)

        if(cart && !cart.status){
            let prod = await pm.getProductByID(pid)

            if(prod && !prod.error){

                let indexOfProd = cart.products.findIndex((p) => p.product === pid)

                if(indexOfProd !== -1){
                    cart.products[indexOfProd].quantity+=1
                } else{
                    cart.products.push({product:pid, quantity: 1})
                }

                try {
                    await cartsModel.updateOne({id: cid, isDeleted: false}, {products: cart.products})
                    return true
                } catch (error) {
                    return {error: 'Error inesperado', message: error.message}
                }

            } else{
                return {status: 'failed', message: `Could not find product with ID ${pid}`}
            }

        } else{
            return {status: 'failed', message: `Could not find cart with ID ${cid}`}
        }

    }

}// cartMAnager

export default cartManager