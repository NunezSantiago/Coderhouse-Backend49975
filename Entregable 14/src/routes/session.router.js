import { Router } from "express";
import passport from 'passport';
import { sessionController } from "../controller/session.controller.js";

export const router=Router()

const isUserLogged = (req, res, next) => {
    if(!req.session.user){
        return res.redirect('/login?message=Please, log in to continue')  
    }
    next()
}

// Login
router.get('/errorLogin', sessionController.errorLogin)
router.post('/login', passport.authenticate('login', {failureRedirect: '/api/sessions/errorLogin'}), sessionController.login)

// Register
router.get('/errorRegister', sessionController.errorRegister)
router.post('/register', passport.authenticate('register', {failureRedirect:'/api/sessions/errorRegister'}), sessionController.register)

// Logout
router.get('/logout', sessionController.logout)

// Current
router.get('/current', sessionController.current)