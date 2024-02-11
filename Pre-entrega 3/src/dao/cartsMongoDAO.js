import { cartsModel } from "../models/carts.model.js";

export class cartsMongoDAO{
    
    constructor(){}

    // Returns all carts
    async get(){
        try {
            return await cartsModel.find({isDeleted: false}).populate('products.product').lean()
        } catch (error) {
            return {error: error}
        }
    }

    // Returns cart with provided ID
    async getByID(cid){
        try {
            return await cartsModel.findOne({_id: cid, isDeleted: false}).populate('products.product').lean()
        } catch (error) {
            return {error: error}
        }
    }

    // Returns cart with provided cartID - deprecated
    // async getByCartID(cid){
    //     try {
    //         return await cartsModel.findOne({cartID: cid, isDeleted: false}).populate('products.product').lean()
    //     } catch (error) {
    //         return {error: error}
    //     }
    // }

    // creates cart and adds products
    async create(products){

        // let cartID

        // try {
		// 	cartID = await cartsModel.find().sort({cartID:-1}).limit(1)
		// 	cartID = cartID[0] ? cartID[0].cartID + 1 : 1
		// } catch (error) {
		// 	return {error: error}
		// } 

        try {
            return await cartsModel.create({products})
            //return cartID
        } catch (error) {
            return {error: error}
        }
    }

    // Updates cart with provided id
    async update(cid, products){

        let cart = []

        products = products.forEach(prod => cart.push({product: prod.product._id, quantity: prod.quantity}))

        try {
            return await cartsModel.updateOne({_id: cid}, {products: cart})
        } catch (error) {
            return {error: error}
        }
    }

    async delete(cid){
        try {
            return await cartsModel.updateOne({_id: cid}, {isDeleted: true})
        } catch (error) {
            return {error: error}
        }
    }
}