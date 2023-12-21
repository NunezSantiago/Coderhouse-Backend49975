import { Router } from "express";
import { usersModel } from "../models/users.model.js";
import crypto from 'crypto'

export const router=Router()

router.post('/login', async (req, res) => {

    let { email, password } = req.body

    if(!email || !password){
        return res.redirect('/login?error=Please, complete all fields')
    }

    if(email === "adminCoder@coder.com"){
        if(password === 'adminCod3r123'){
            req.session.user = {
                username: 'Admin Coder',
                email: 'adminCoder@coder.com',
                role: 'Admin'
            }
            return res.redirect('/products')
        } else{
            return res.redirect('/login?error=Invalid credentials')
        }
    }

    password = crypto.createHmac("sha256", "CoderCoder").update(password).digest("hex")

    let user = await usersModel.findOne({email, password})

    if(!user){
        return res.redirect('/login?error=Invalid credentials')
    }

    req.session.user = {
        username: user.username,
        email: user.email,
        role: user.role
    }

    return res.redirect('/products')
})

router.post('/logon', async (req, res) => {

    let {username, email, password} = req.body

    if(!username || !email || !password){
        return res.redirect('/logon?error=Please, complete all fields')
    }

    let exists = await usersModel.findOne({email})

    if(exists){
        return res.redirect(`/logon?error=There is another user with email: "${email}", please, select another email`)
    } else{
        password = crypto.createHmac("sha256", "CoderCoder").update(password).digest("hex")
        let newUser
        try {
            newUser = await usersModel.create({username: username, email:email, password:password, role: 'User'})
            return res.redirect('/login?message=User successfully created')
        } catch (error) {
            return res.redirect(`/logon?error=Unexpected error, please, try again in a few minutes.`)
        }
    }   

})

router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if(error){
            return res.redirect('/login?error=Unable to log out, please, try again.')
        }
    })

    return res.redirect('/login')
})