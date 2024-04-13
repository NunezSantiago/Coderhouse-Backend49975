import { usersService } from "../services/user.service.js"
import { cartsService } from "../services/carts.service.js"
import { createHash, validatePassword } from "../utils.js"
import { userReadDTO } from "../dto/usersDTO.js"
import jwt from 'jsonwebtoken'
import { config } from "../config/config.js"
import { sendEmail } from "../mails/mail.js"
import { customError } from "../utils/customErrors.js"
import { STATUS_CODES, INTERNAL_CODES } from "../utils/errorCodes.js";

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

        let update_flag = true

        if(user.role == "Premium"){
            params.role = "User"
        }

        let documents = user.documents.map( (doc) => doc.name )

        let requiredFiles = ['identificacion', 'comprobante_domicilio', 'estado_de_cuenta']

        for(let index of requiredFiles){
            if(!documents.includes(index)){
                update_flag = false
                break
            }
        }

        if(update_flag){
            
            if(user.role == "User"){
                params.role = "Premium"
            }

            let updateRole = await usersService.updateUser(uid, params)

            if(!updateRole.error){
                req.logger.info("Role updated successfully")
                return res.status(200).json("User role updated successfully")
            } else{
                let error = customError.customError("Database unexpected error", updateRole.error.message, STATUS_CODES.ERROR_ARGUMENTOS, INTERNAL_CODES.DATABASE, "Database unexpected error, please, retry later")
                req.logger.error(error)
                return res.status(error.statusCode).json(error)
            }
        } else {
            return res.status(401).json({Error: "Unauthorized. Please upload all required files to change your role to Premium"})
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

        let token = jwt.sign({...userDTO}, config.SECRETKEY, {expiresIn:"1h"})

        let message = `Hey ${user.first_name}, you can reset your password clicking this button: <a href="http://localhost:${config.PORT}/api/users/pwdReset02?token=${token}">Reset Password</a>`

        let response = await sendEmail(email, "Password reset request", message)

        if(response.accepted.length > 0){
            return res.redirect('/login?message=Follow the instructions sent to your email to reset your password')
        } else {
            return res.redirect('/login?error=Failed to reset passowrd. Please, try again later.')
        }
    }

    static async pwdReset02(req, res){
        console.log("TEST")
        let { token } = req.query
        try{
            let tokenData = jwt.verify(token, config.SECRETKEY)
            return res.redirect('/pwdReset02?token='+token)
        } catch(error) {
            return res.redirect('/pwdReset?error=Link has expired, please, create a new one completing the form')
        }
    }

    static async pwdReset03(req, res){
        let { password, repeatPassword, token } = req.body
        let tokenData = jwt.verify(token, config.SECRETKEY)

        let user = await usersService.getUserByEmail(tokenData.email)

        if(password != repeatPassword){
            return res.redirect(`/pwdReset02?token=${token}&error=Passwords do not match`)
        } else if(validatePassword(user, password)){
            return res.redirect(`/pwdReset02?token=${token}&error=New password cannot be the same as current password`)
        } else{
            password = createHash(password)
            let params = {password}
            let updatePassword = usersService.updateUser(user._id, params)
            if(!updatePassword.error){
                return res.redirect("/login?message=Password updated successfully")
            } else{
                return res.redirect(`/pwdReset02?token=${token}&error=Failed to update password, please, try again later`)
            }
        }
    }

    static async fileUpload(req, res){
        // documents.forEach((doc) => {
        //     if(doc.name === "identificacion" || doc.name === "comprobante_domicilio" || doc.name === "estado_de_cuenta"){
        //         old_files[doc.name] = doc.reference
        //     }
        // })

        //let uid = req.params.uid
        let user = await usersService.getUserByID(req.params.uid)
        
        if(user){
            
            let fileNames = Object.keys(req.files)
            
            let index = 
            {
                'identificacion': false, 
                'comprobante_domicilio': false, 
                'estado_de_cuenta': false
            } // only files with this fieldname can be uploaded
            
            fileNames.forEach( (file) => {
                index[file] = true
            })

            let documents = user.documents // Current user documents

            documents.forEach( (doc) => {
                if(index[doc.name]){
                    doc.reference = req.files[doc.name][0].path
                    index[doc.name] = false
                }
            })

            for(let key in index){
                if(index[key]){
                    documents.push({
                        name: req.files[key][0].fieldname,
                        reference: req.files[key][0].path
                    })
                }
            }

            let updateUser = await usersService.updateUser(user._id, {documents})
            
            res.setHeader('Content-Type', 'text/html')
            return res.redirect('/profile?message=Files uploaded successfully')
        } else {
            return res.status(404).json({error: "User not found"})
        }
    }

}