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
        return await this.dao.getBy(email)
    }


        
}

export const usersService = new userService(usersMongoDAO)