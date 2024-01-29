import { cartsMongoDAO } from "../dao/cartsMongoDAO.js";

class cartService{
    constructor(dao){
        this.dao = new dao()
    }

    async getCarts(){
        return await this.dao.get()
    }

    async getCartByID(cid){
        return await this.dao.getByID(cid)
    }

    async createCart(products){
        return await this.dao.create(products)
    }

    async updateCart(cid, products){
        return await this.dao.update(cid, products)
    }
}

export const cartsService = new cartService(cartsMongoDAO)