import { usersService } from "../services/user.service.js"
import { cartsService } from "../services/carts.service.js"
import { createHash } from "../utils.js"

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

    static async getUserByEmail(req, res){
        res.setHeader("Content-Type", "application/json")

        let { email } = req.params

        let users = await usersService.getUserByEmail(email)

        if(users.error){
            return res.status(400).json({error: users.error.message})
        } else{
            return res.status(200).json(user)
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

        let cartID = await cartsService.createCart([])
        let userCart = await cartsService.getCartByCartID(cartID)

        password = createHash(password)
        
        // User creation

        let newUser = await usersService.createUser({ cart: userCart._id ,first_name, last_name, email, password, role })


        //is payload necessary?
        if(newUser.error){
            return res.status(400).json({error: newUser.error.message})
        } else{
            return res.status(200).send({payload: newUser, message:'User successfully created'})
        }
    }
}