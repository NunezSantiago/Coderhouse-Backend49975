//import { productsMemoryDAO as productsDAO } from "../dao/productsMemoryDAO.js"
//import { productsMongoDAO as productsDAO } from "../dao/productsMongoDAO.js";
import { DAO } from "../dao/factory.js";

class productService{
    constructor(dao){
        this.dao = new dao()
    }

    async getAllProducts(){
        return await this.dao.getAll()
    }

    async getProducts(conf, query){
        return await this.dao.get(conf, query)
    }

    async createProduct(product){
        return await this.dao.create(product)
    }

    async getProductByCode(code){
        return await this.dao.getByCode(code)
    }

    async getProductByID(id){
        return await this.dao.getByID(id)
    }

    async updateProduct(pid, params){
        return await this.dao.update(pid, params)
    }

    async deleteProduct(pid){
        return await this.dao.delete(pid)
    }
}

export const productsService = new productService(DAO.productsDAO)