import { usersService } from "../services/user.service.js"

//usersService

export class usersController {
    
    constructor(){}

    static async getUsers(req, res){

        res.setHeader("Content-Type", "application/json")

        let users = await usersService.getUsers()
        if(users.error){
            return res.status(400).json({error: users.error.message})
        } else{
            //console.log('test')
            return res.status(200).json(users)
        }
    }

    static async createUser(req, res){

        res.setHeader("Content-Type", "application/json")
        
        
        let { first_name, last_name, email, password, role } = req.body
        
        if(!first_name || !last_name || !email || !password || !role){
            return res.status(400).json({error: "Information missing"})
        }

        // Email validation

        let exist = await usersService.getUserByEmail(email)

        console.log(exist)

        if(exist){
            return res.status(400).json({error: `User with email ${email} already exists`})
        }
        
        // User creation

        let newUser = usersService.createUser({ first_name, last_name, email, password, role })

        if(newUser.error){
            return res.status(400).json({error: newUser.error.message})
        } else{
            return res.status(200).send('User successfully created')
        }
    }
}