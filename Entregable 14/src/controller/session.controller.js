import { userReadDTO } from "../dto/usersDTO.js"

export class sessionController{
    
    constructor(){}

    static async errorLogin(req, res){
        return res.redirect('/login?error=Failed to login.')
    }

    static async login(req, res){

        req.session.user = {
            _id: req.user._id,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            role: req.user.role,
            cart: req.user.cart
        }

        return res.redirect('/products')
    }

    static async errorRegister(req, res){
        return res.redirect('/register?error=Registration failed, please try again later')
    }

    static async register(req, res){
        return res.redirect('/login?message=User successfully created')  
    }

    static async logout(req, res){
        req.session.destroy(error => {
            if(error){
                return res.redirect('/login?error=Unable to log out, please, try again.')
            }
        })
    
        return res.redirect('/login')
    }

    static async current(req, res){

        res.setHeader("Content-Type", "application/json");

        
        if(req.session.user){
            let user = new userReadDTO(req.session.user)
            res.status(200).send(user)
        } else{
            res.status(404).json({error: `No active session available`})
        }
    }
}