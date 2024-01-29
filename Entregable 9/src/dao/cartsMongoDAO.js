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

    // creates cart and adds products
    async create(products){
        try {
            return await cartsModel.create({products})
        } catch (error) {
            return {error: error}
        }
    }

    // Updates cart with provided id
    async update(cid, products){

        console.log(products)
        try {
            return await cartsModel.updateOne({_id: cid}, {products})
        } catch (error) {
            return {error: error}
        }
    }

    async delete(cid){
        try {
            
        } catch (error) {
            return {error: error}
        }
    }
}