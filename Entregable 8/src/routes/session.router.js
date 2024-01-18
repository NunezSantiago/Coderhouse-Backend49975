import { Router } from "express";
import { usersModel } from "../models/users.model.js";
//import crypto, { createHash } from 'crypto'
import {createHash, validatePassword} from '../utils.js'
//import { passportInit } from './config/config.passport.js';
import passport from 'passport';
import { passportInit } from "../config/config.passport.js";

export const router=Router()

router.get('errorLogin', (req, res) => {
    return res.redirect('/login?error=Failed to login.')
})

//LOGIN
router.post('/login', passport.authenticate('login', {failureRedirect: '/api/session/errorLogin'}), async (req, res) => {

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        role: req.user.role
    }

    //console.log(req.session.user)

    return res.redirect('/products')
})

router.get('/errorRegistro', (req, res) => {
    return res.redirect('/logon?error = Registration failed, please try again later')
})

//REGISTER
router.post('/logon', passport.authenticate('register', {failureRedirect:'/api/session/errorRegistro'}), async (req, res) => {

    return res.redirect('/login?message=User successfully created')  

})

router.get('/callbackGithub', passport.authenticate('github', {failureRedirect: '/api/session/errorLogin'}), (req, res) => {

    req.session.user = req.user
    
    return res.redirect('/products')
})

router.get('/github', passport.authenticate('github', {}), async (req, res) => {


})

//LOGOUT
router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if(error){
            return res.redirect('/login?error=Unable to log out, please, try again.')
        }
    })

    return res.redirect('/login')
})

router.get('/current', async (req, res) => {
    if(req.session.user){
        return req.session.user
    } else{
        return "No active session available"
    }
})