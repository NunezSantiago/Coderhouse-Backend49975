import { cartsModel } from "../models/carts.model.js";
import { productsModel } from "../models/products.model.js";
import productManager from "./productManager_MONGO.js";

/*
To do:

delete get cid => Removes all products from cart | done 12-Dec
delete get cid pid => Removes product from cart | done 12-Dec
post get cid pid and quantity => Add certain quantity to that product in cart - Can modify addProductToCart | done 12-Dec

*/

let pm = new productManager()

class cartManager{

    async getCarts(){
        let carts = []

        try {
            carts = await cartsModel.find({isDeleted : false}).lean()
        } catch (error) {
            console.log(error.message)
        }

        return carts
    }

    async getCartByID(cid){
        let cart

        try {
            cart = await cartsModel.findOne({id: cid, isDeleted: false}).populate('products.product').lean()
        } catch (error) {
            return {status: 'failed', error: error.message}
        }
        
        if(!cart){
            return {status: 'success', message: `Could not find cart with ID ${cid}`}
        }else{
            return cart
        }
    }

    //working with _id
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
            productsInCart.push({product: elem._id, quantity: 1})
        })
        } else{
            return {status: 'failed', error: "Could not find products with provided ids"}
        }
        
        try {
            await cartsModel.create({id: id, products: productsInCart})
            return id
        } catch (error) {
            return {error: 'Error inesperado', message: error.message}
        }
    }

    //working with _id
    async addProductToCart(cid, pid, quantity){

        let cart = await this.getCartByID(cid)

        if(cart && !cart.status){
            let prod = await pm.getProductByObjectID(pid)

            if(prod && !prod.error){
                let indexOfProd = cart.products.findIndex((p) => p.product._id.toString() == prod._id.toString())

                if(indexOfProd !== -1){
                    cart.products[indexOfProd].quantity+=quantity
                } else{
                    cart.products.push({product:prod._id, quantity: quantity})
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

    async addProductsToCart(cid, products){

        let cart = await this.getCartByID(cid)

        //console.log(products)

        if(cart && !cart.status){

            let productsInCart = []

            let ids = products.map(prod => prod.product) // Array of IDs of passed products

            let availableProducts = []

            try {
                availableProducts = (await productsModel.find({_id: {'$in': ids}, isDeleted: false}, '_id')).map(prod => prod._id.toString()) // Interseccion entre array de IDs y productos en DB
            } catch (error) {
                console.log(error.message)
            }

            productsInCart = products.filter(prod => availableProducts.includes(prod.product))

            if(productsInCart.length === 0) {
                return {status: 'failed', message:`Products could not be found in the database`}
            } else{
                try {
                    await cartsModel.updateOne({id: cid, isDeleted: false}, {products: productsInCart})
                } catch (error) {
                    console.log(error.message)
                }

                if(productsInCart.length !== ids.length){
                    return {status: 'success', message:`Partial success: ${productsInCart.length} of ${ids.length} products were successfully added to cart with ID ${cid}`}
                } else {
                    return {status: 'success', message:`${productsInCart.length} products were successfully added to cart with ID ${cid}`}
                }
            }

            

        }

    }

    async removeProductsFromCart(cid){
        let cart = await this.getCartByID(cid)

        if(cart && !cart.status){
            try {
                await cartsModel.updateOne({id: cid, isDeleted: false}, {products: []})
                return true
            } catch (error) {
                return {error: 'Error inesperado', message: error.message}
            }
        } else{
            return {status: 'failed', error: `Could not find cart with ID ${cid}`}
        }
    }

    async removeProductFromCart(cid, pid){

        let cart = await this.getCartByID(cid)

        if(cart && !cart.status){
            let prod = await pm.getProductByID(pid)

            if(prod && !prod.error){

                let filteredProducts = cart.products.filter(p => p.product._id.toString() !== prod._id.toString())

                //console.log(filteredProducts)

                if(filteredProducts.length == cart.products.length){
                    return {status: 'failed', error: "Product not in cart"}
                } else{
                    try {
                        await cartsModel.updateOne({id: cid, isDeleted: false}, {products: filteredProducts})
                        return true
                    } catch (error) {
                        return {status: 'failed', message: error.message}
                    }
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