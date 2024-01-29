import { Router } from "express";
import passport from 'passport';
import { sessionController } from "../controller/session.controller.js";


export const router=Router()

// Login
router.get('errorLogin', sessionController.errorLogin)
router.post('/login', passport.authenticate('login', {failureRedirect: '/api/sessions/errorLogin'}), sessionController.login)

// Register
router.get('/errorRegistro', sessionController.errorRegister)
router.post('/register', passport.authenticate('register', {failureRedirect:'/api/sessions/errorRegistro'}), sessionController.register)

// Logout
router.get('/logout', sessionController.logout)

// Current
router.get('/current', sessionController.current)