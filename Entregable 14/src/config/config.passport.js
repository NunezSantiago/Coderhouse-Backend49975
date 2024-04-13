import { createHash, validatePassword } from "../utils.js";

import passport from "passport";
import local from "passport-local"
//import github from "passport-github2"

import { usersService } from "../services/user.service.js";
import { cartsService } from "../services/carts.service.js"

/*
App ID: 754474

Client ID: Iv1.bd025e03f6532147

d5e084e7f71f7c14c22b772570cbc0e2351721f5
*/

export const passportInit = () => {

    //REGISTER LOCAL
    passport.use('register', new local.Strategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        try {

            let {first_name, last_name, age, email, role} = req.body

            if(!first_name || !last_name || !age || !email || !password){
                return done(null, false)
            }

            if(!role){
                role = 'User'
            }

            let exist = await usersService.getUserByEmail(username)

            if(exist){
                console.log(exist)
                return done(null, false)
            }

            password = createHash(password)

            let cartID = await cartsService.createCart([])

            //console.log(cartID)
            
            let newUser = await usersService.createUser({ cart: cartID._id, age, first_name, last_name, email, password, role })

            if(newUser.error){
                return done(null, false)
            } else{
                return done(null, newUser)
            }


        } catch (error) {
            done(error)
        }
    }))

    //LOGIN LOCAL
    passport.use('login', new local.Strategy({
        usernameField: 'email'
    }, async (username, password, done) =>{
        try{

            if(!username || !password){
                return done(null, false)
            }
        
            let user = await usersService.getUserByEmail(username)
        
            if(!user){
                return done(null, false)
            } 
            
            if(!validatePassword(user, password)){
                return done(null, false)
            }

            delete user.password

            await usersService.updateUser(user._id, {last_connection: new Date()})

            return done(null, user)

        } catch (error) {
            done(error)
        }
        
    }))

    //REGISTER GITHUB - Deprecated
    
    // passport.use('github', new github.Strategy({
    //     clientID: "Iv1.bd025e03f6532147",
    //     clientSecret: "d5e084e7f71f7c14c22b772570cbc0e2351721f5",
    //     callbackURL: "http://localhost:8080/api/session/callbackGithub"
    // }, 
    // async(accessToken, refreshToken, profile, done) => {
    //     try {
    //         console.log(profile)

    //         let user = await usersModel.findOne({email: profile._json.email})

    //         if(!user){
    //             let newUser = {
    //                 name: profile._json.name, 
    //                 email: profile._json.email, 
    //                 role:'user', 
    //                 profile
    //             }

    //             user = await usersModel.create(newUser)
    //         }

    //         return done(null, user)

    //     } catch (error) {
    //         return done(error)
    //     }
    // }))

    //LOGIN GITHUB

    passport.serializeUser((user, done) => {
        return done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await usersService.getUserByID(id)
        return done(null, user)
    })

}