import { config } from "../src/config/config.js";
import mongoose from "mongoose";
import { cartsModel } from "../src/models/carts.model.js";
import { usersModel } from "../src/models/users.model.js";
import { productsModel } from "../src/models/products.model.js";

import { describe, it, test } from "mocha"
import { expect } from "chai";
import supertest from "supertest-session";

const requester = supertest("http://localhost:8080")
await mongoose.connect(config.MONGO_URL, {dbName: config.DBNAME})

describe("Testing carts router", function(){
    
    this.timeout(7000)
    
    let testingCartID 
    let testingProductID
    let deleteCartID // ID of cart created to test cart creation. Should be deleted in after

    // let toBeDeleted = {
    //     product: [],
    //     cart: [],
    //     productsFromCarts: []
    // }

    before(async function(){
        let login = await requester.post("/api/sessions/login").send({email: "test@test.com", password:"123"})
        
        let product = {
            title: "Testing",
            owner: "test@test.com",
            description: "This is a test product",
            price: 1500,
            code: "TEST001",
            stock: 100,
            category: "Test"
        }

        let testingProduct = await productsModel.create(product)
        testingProductID = testingProduct._id.toString()
        
        let user = await usersModel.findOne({email: "test@test.com"})
        testingCartID = user.cart
    })

    after(async function(){

        await productsModel.deleteOne({_id: testingProductID})

        await cartsModel.deleteOne({_id: deleteCartID})

        // let cart = await cartsModel.findOne({_id: testingCartID})
        // cart.products.pop()
        // await cartsModel.updateOne({_id: testingCartID}, {products: cart.products})

    })

    it("GET: /api/carts - Returns all carts", async function(){
        let result = await requester.get("/api/carts")

        expect(result.status).to.be.equal(200)

        result._body.forEach(cart => {
            expect(cart._id).to.be.ok
        });
    })

    it("GET: /api/carts/:cid - Returns cart with _id cid", async function(){

        let path = '/api/carts/' + testingCartID.toString()
        let result = await requester.get(path)

        expect(result._body._id).to.be.equal(testingCartID.toString())
    })

    it("POST: /api/carts - Creates a cart", async function(){
        let result = await requester.post('/api/carts').send({products: [testingProductID]})

        let createdCart = await cartsModel.findOne({_id: result._body.cartID})
        deleteCartID = createdCart._id
        
        expect(createdCart).to.be.ok
        expect(createdCart.products[0].product.toString()).to.be.equal(testingProductID)
    })

    it("POST: /api/carts/:cid/product/:pid - Adds product with _id pid to the cart with _id cid", async function(){
        
        let path = `/api/carts/${testingCartID}/product/${testingProductID}`
        let result = await requester.post(path).send({quantity: 5})

        let cart = await cartsModel.findOne({_id: testingCartID})

        let addedProduct = cart.products.pop()
        
        expect(addedProduct.product.toString()).to.be.equal(testingProductID)
        expect(addedProduct.quantity).to.be.equal(5)
    })

    it("Delete: /api/carts/:cid/product/:pid - Removes product with _id pid from the cart with _id cid", async function(){
        
        let path = `/api/carts/${testingCartID}/product/${testingProductID}`
        let result = await requester.delete(path)
        let cart = await cartsModel.findOne({_id: testingCartID})

        let ProductNotInCart = true

        cart.products.forEach(prod => {
            if(prod.product.toString() == testingProductID){
                ProductNotInCart = false
            }
        })

        expect(ProductNotInCart).to.be.equal(true)
    })
})