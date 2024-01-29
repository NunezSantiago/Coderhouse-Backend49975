import { usersMongoDAO } from "../dao/usersMongoDAO.js"

class userService{

    constructor(dao){
        this.dao = new dao()
    }

    async getUsers(){
        return await this.dao.get()
    }

    async createUser(user){
        return await this.dao.create(user)
    }

    async getUserByEmail(email){
        return await this.dao.getByEmail(email)
    }

    async getUserByID(uid){
        return await this.dao.getByID(uid)
    }


        
}

export const usersService = new userService(usersMongoDAO)