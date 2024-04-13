import { config } from "../src/config/config.js";
import mongoose from "mongoose";
import { usersModel } from "../src/models/users.model.js";

import { describe, it, test } from "mocha"
import { expect } from "chai";
import supertest from "supertest-session";

const requester = supertest("http://localhost:8080")
await mongoose.connect(config.MONGO_URL, {dbName: config.DBNAME})

describe("Testing Sessions router", function(){
    
    this.timeout(7000)
    
    let testingUserID

    before(async function(){

    })

    after(async function(){
        await usersModel.deleteOne({_id: testingUserID})
    })

    it("POST: /api/sessions/register - Creates one user", async function(){
        
        let result = await requester.post('/api/sessions/register').send({
            first_name: "Testing user first name",
            last_name: "Testing user last name",
            age: 22,
            email: "testingUser@testingUserID.com",
            password: "testing"
        })

        let newUser = await usersModel.findOne({email: "testingUser@testingUserID.com"})
        testingUserID = newUser._id

        expect(newUser).to.be.ok
        expect(newUser._id).to.be.ok
        expect(newUser.cart).to.be.ok
    })

    it("POST: /api/sessions/login - Login", async function(){
        
        let result = await requester.post("/api/sessions/login").send({email: "testingUser@testingUserID.com", password:"testing"})
        // If user is redirected to products page, it means that the login was successful
        //Else, the user would be redirected to errorLogin
        let user = await usersModel.findOne({email: "testingUser@testingUserID.com"})
        expect(result.header.location).to.be.equal("/products")
        expect(user.last_connection).to.be.ok
    })

    it("GET: /api/sessions/logout - Deletes current session", async function(){
        await requester.get("/api/sessions/logout")
        let currentSession = await requester.get("/api/sessions/current")

        expect(currentSession.status).to.be.equal(404)
        expect(currentSession._body.error).to.be.equal("No active session available")
    })
    
    it("GET: /api/sessions/current - Returns information of the current session", async function(){
        
        let login = await requester.post("/api/sessions/login").send({email: "testingUser@testingUserID.com", password:"testing"})
        let result = await requester.get("/api/sessions/current")
        
        expect(result._body.email).to.be.equal("testingUser@testingUserID.com")
    })
})