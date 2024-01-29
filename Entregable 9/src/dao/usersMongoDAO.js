import { usersModel } from "../models/users.model.js";

export class usersMongoDAO{

    constructor(){}

    async get(){
        try {
            return await usersModel.find({isDeleted: false})
        } catch (error) {
            return {error}
        }
    }

    async getBy(email){
        try {
            return await usersModel.findOne({email: email})
        } catch (error) {
            return {error}
        }
    }
    
    async create(user){
        try {
            return await usersModel.create(user)
        } catch (error) {
            return {error}
        }
    }

}
