import passport from "passport";
import local from "passport-local"
import github from "passport-github2"
import { usersModel } from "../models/users.model.js";
import { createHash, validatePassword } from "../utils.js";

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

            let {name, email} = req.body

            if(!name || !email || !password){
                return done(null, false)
            }

            let exists = await usersModel.findOne({email})

            if(exists){
                return done(null, false)
            } else{
            
                password = createHash(password)

                let newUser
                try {
                    newUser = await usersModel.create({name: name, email:email, password:password, role: 'User'})
                    return done(null, newUser)
                } catch (error) {
                    return done(null, false)
                }
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
        
            let user = await usersModel.findOne({email: username}).lean()
        
            if(!user){
                return done(null, false)
            } 
            
            if(!validatePassword(user, password)){
                return done(null, false)
            }

            delete user.password

            return done(null, user)

        } catch (error) {
            done(error)
        }
        
    }))

    //REGISTER GITHUB
    passport.use('github', new github.Strategy({
        clientID: "Iv1.bd025e03f6532147",
        clientSecret: "d5e084e7f71f7c14c22b772570cbc0e2351721f5",
        callbackURL: "http://localhost:8080/api/session/callbackGithub"
    }, 
    async(accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile)

            let user = await usersModel.findOne({email: profile._json.email})

            if(!user){
                let newUser = {
                    name: profile._json.name, 
                    email: profile._json.email, 
                    role:'user', 
                    profile
                }

                user = await usersModel.create(newUser)
            }

            return done(null, user)

        } catch (error) {
            return done(error)
        }
    }))

    //LOGIN GITHUB

    passport.serializeUser((user, done) => {
        return done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await usersModel.findById(id)
        return done(null, user)
    })

}