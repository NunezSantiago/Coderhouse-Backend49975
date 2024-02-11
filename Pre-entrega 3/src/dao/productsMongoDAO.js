import { productsModel } from "../models/products.model.js";

export class productsMongoDAO{

    constructor(){}

    // Returns all products Raw
    async getAll(){
        try {
			return await productsModel.find({isDeleted: false}).lean()
		} catch (error) {
            return {error: error}
		}
    }

    // Returns all products (with pagination)
    async get(conf, query){
        try {
			return await productsModel.paginate(query, conf)
		} catch (error) {
            return {error: error}
		}
    }

    // Returns product with provided Code 
    async getByCode(code){
        try {
            return await productsModel.findOne({code: code, isDeleted: false}).lean()
        } catch (error) {
            return {error: error}
        }
    }

    // Returns product with provided ID
    async getByID(pid){
        try {
            return await productsModel.findOne({_id: pid, isDeleted: false}).lean()
        } catch (error) {
            return {error: error}
        }
    }

    // Creates product
    async create(product){
        try {
            return await productsModel.create(product)
        } catch (error) {
            return {error: error}
        }
    }
    
    // Updates product with provided id
    async update(pid, params){
        try {
            return await productsModel.updateOne({_id: pid}, params)
        } catch (error) {
            return {error: error}
        }
    }

    //Deletes product with provided ID
    async delete(pid){
        try {
            return await productsModel.updateOne({_id: pid}, {isDeleted: true})
        } catch (error) {
            return {error: error}
        }
    }
}