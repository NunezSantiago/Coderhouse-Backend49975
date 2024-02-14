// import { usersMongoDAO as usersDao } from "../dao/usersMongoDAO.js"
// import { usersMemoryDAO as usersDao } from "../dao/usersMemoryDAO.js"
import { DAO } from "../dao/factory.js";

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

export const usersService = new userService(DAO.usersDAO)