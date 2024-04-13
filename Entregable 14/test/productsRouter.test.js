import { config } from "../src/config/config.js";
import { productsModel } from "../src/models/products.model.js";
import mongoose from "mongoose";

import { describe, it } from "mocha"
import { expect } from "chai";
import supertest from "supertest-session";

const requester = supertest("http://localhost:8080")
await mongoose.connect(config.MONGO_URL, {dbName: config.DBNAME})

describe("Testing Products router", function(){

    this.timeout(7000)

    let testingID 

    before(async function(){
        let login = await requester.post("/api/sessions/login").send({email: "test@test.com", password:"123"})
    })
    
    after(async function(){
        //Deletes all products that includes testing in their title 
        await productsModel.deleteMany({title: {"$regex": "Testing", "$options": "i"}})
    })
    
    it("GET: /api/products - Returns all products only if the user is logged", async function(){
        
        let result = await requester.get("/api/products")

        expect(result.status).to.be.equal(200)
        
        result._body.docs.forEach(prod => {
            expect(prod._id).to.be.ok
        });
    })

    it("POST: /api/products", async function(){

        let newProduct = {
            title: "Testing",
            owner: "test@test.com",
            description: "This is a test product",
            price: 1500,
            code: "TEST001",
            stock: 100,
            category: "Test"
        }

        let result = await requester.post("/api/products").send(newProduct)

        let test = await productsModel.findOne({code: "TEST001"})

        testingID = test._id.toString()

        expect(test).to.be.ok
        expect(test._id).to.be.ok
    })

    it("PUT: /api/products/:pid - Update one or multiple fields of a product", async function(){
        
        let params = {
            title: 'Testing Update'
        }
        
        let path = "/api/products/" + testingID
        
        let result = await requester.put(path).query({_id: testingID}).send(params)

        let updatedProduct = await productsModel.findOne({code: "TEST001"})

        expect(updatedProduct).to.be.ok
        expect(updatedProduct.title).to.be.equal("Testing Update")
        expect(updatedProduct._id.toString()).to.be.equal(testingID)

    })

    it("DELETE: /api/products/:pid - Deletes product with Id pid", async function(){
        
        let path = "/api/products/"

        let result = await requester.delete(path + testingID)

        let deletedProduct = await productsModel.findOne({code: "TEST001"})
        
        expect(deletedProduct.isDeleted).to.be.equal(true)
    })

})

