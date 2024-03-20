import { usersService } from "../services/user.service.js"
import { cartsService } from "../services/carts.service.js"
import { createHash, validatePassword } from "../utils.js"
import { userReadDTO } from "../dto/usersDTO.js"
import jwt from 'jsonwebtoken'
import { config } from "../config/config.js"
import { sendEmail } from "../mails/mail.js"
import { customError } from "../utils/customErrors.js"
import { STATUS_CODES, INTERNAL_CODES } from "../utils/errorCodes.js";

//usersService

export class usersController {
    
    constructor(){}

    static async getUsers(req, res){

        res.setHeader("Content-Type", "application/json")

        let users = await usersService.getUsers()
        if(users.error){
            return res.status(400).json({error: users.error.message})
        } else{
            return res.status(200).json(users)
        }
    }

    // static async getUserByEmail(req, res){
    //     res.setHeader("Content-Type", "application/json")

    //     let { email } = req.params

    //     let user = await usersService.getUserByEmail(email)

    //     if(user){
    //         return res.status(200).json(user)
    //     } else {
    //         return res.status(400).json({error: user.error.message})
    //     }
    // }

    static async createUser(req, res){

        res.setHeader("Content-Type", "application/json")
        
        let { first_name, last_name, email, password, role } = req.body
        
        if(!first_name || !last_name || !email || !password){
            return res.status(400).json({error: "Information missing"})
        }

        if(!role){
            role = 'User'
        }

        // Email validation

        let exist = await usersService.getUserByEmail(email)

        if(exist){
            return res.status(400).json({error: `User with email ${email} already exists`})
        }

        let userCart = await cartsService.createCart([])

        console.log(userCart)

        password = createHash(password)

        let newUser = await usersService.createUser({ cart: userCart._id, first_name, last_name, email, password, role })

        console.log(newUser)

        if(newUser.error){
            return res.status(400).json({error: newUser.error.message})
        } else{
            return res.status(200).send({payload: newUser, message:'User successfully created'})
        }
    }

    static async updateRole(req, res){
        
        let uid = req.params.uid
        let user = await usersService.getUserByID(uid)

        if(!user){
            let error = customError.customError("User not found", `Unable to find user with ID ${uid}`, STATUS_CODES.NOT_FOUND, INTERNAL_CODES.DATABASE, `Unable to find user with ID ${uid}`)
            req.logger.error(error)
            return res.status(error.statusCode).json(error)
        }

        if(user.role == "Admin"){
            req.logger.warning("Unable to update role as user is already an administrator")
            return res.status(200).json("User is already an administrator")
        }

        let params = {}

        if(user.role == "User"){
            params.role = "Premium"
        }

        if(user.role == "Premium"){
            params.role = "User"
        }

        let updateRole = usersService.updateUser(uid, params)

        if(!updateRole.error){
            req.logger.info("Role updated successfully")
            return res.status(200).json("User role updated successfully")
        } else{
            let error = customError.customError("Database unexpected error", updateRole.error.message, STATUS_CODES.ERROR_ARGUMENTOS, INTERNAL_CODES.DATABASE, "Database unexpected error, please, retry later")
            req.logger.error(error)
            return res.status(error.statusCode).json(error)
        }
    }

    static async pwdReset01(req, res){
        let { email } = req.body

        let user = await usersService.getUserByEmail(email)

        if(!user){
            let error = customError.customError("User not found", `Unable to find user with email ${email}`, STATUS_CODES.NOT_FOUND, INTERNAL_CODES.DATABASE, `Unable to find user with email ${email}`)
            req.logger.error(error)
            return res.redirect('/pwdReset?error=User not found.')
        }

        let userDTO=new userReadDTO(user)

        console.log(userDTO)

        let token = jwt.sign({...userDTO}, config.SECRETKEY, {expiresIn:"1h"})

        let message = `Hey ${user.first_name}, you can reset your password clicking this button: <a href="http://localhost:${config.PORT}/api/users/pwdReset02?token=${token}">Reset Password</a>`

        let response = await sendEmail(email, "Password reset request", message)

        //return res.status(200).json(response)

        if(response.accepted.length > 0){
            res.redirect('/login?message=Follow the instructions sent to your email to reset your password')
        } else {
            res.redirect('/login?error=Failed to reset passowrd. Please, try again later.')
        }
    }

    static async pwdReset02(req, res){
        console.log("TEST")
        let { token } = req.query
        try{
            let tokenData = jwt.verify(token, config.SECRETKEY)
            res.redirect('/pwdReset02?token='+token)
            //res.redirect
        } catch(error) {
            res.redirect('/pwdReset?error=Link has expired, please, create a new one completing the form')
        }
    }

    static async pwdReset03(req, res){
        let { password, repeatPassword, token } = req.body
        let tokenData = jwt.verify(token, config.SECRETKEY)

        let user = await usersService.getUserByEmail(tokenData.email)

        if(password != repeatPassword){
            res.redirect(`/pwdReset02?token=${token}&error=Passwords do not match`)
        } else if(validatePassword(user, password)){
            res.redirect(`/pwdReset02?token=${token}&error=New password cannot be the same as current password`)
        } else{
            password = createHash(password)
            let params = {password}
            let updatePassword = usersService.updateUser(user._id, params)
            if(!updatePassword.error){
                res.redirect("/login?message=Password updated successfully")
            } else{
                res.redirect(`/pwdReset02?token=${token}&error=Failed to update password, please, try again later`)
            }
        }
    }
}