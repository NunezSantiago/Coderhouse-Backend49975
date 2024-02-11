export class usersMemoryDAO{
    constructor(){
        this.users = [
            {
                "cart": 2,
                "first_name": "Santiago",
                "last_name": "Nuñez",
                "email": "nunezsantiago43@gmail.com",
                "password": "$2b$10$k4Z1gfUcWfxNDaWulnFBMOgL2fv5zVWk3/FZXaLLaLAbAt6S6Tw.q",
                "role": "User",
                "_id": 1,
                "isDeleted": false,
                "createdAt": "2024-02-11T15:10:18.432Z",
                "updatedAt": "2024-02-11T15:10:18.432Z"
            },
            {
                "cart": 3,
                "first_name": "test",
                "last_name": "test",
                "email": "test@test.com",
                "password": "$2b$10$Fg1kZI792QNVO/4xdZI2zuMrEe2uGENtg.oBLOJMYVpAeofmKmltq",
                "role": "User",
                "_id": 1,
                "isDeleted": false,
                "createdAt": "2024-02-11T15:10:51.562Z",
                "updatedAt": "2024-02-11T15:10:51.562Z"
            }
        ]
    }

    async get(){
        return this.users.filter(user => !user.isDeleted)
    }

    async getByID(uid){
        let user = this.users.find(user => user._id == uid && !user.isDeleted)

    }

    async getByEmail(email){
        return this.users.find(user => user.email == email && !user.isDeleted)
    }

    async create(user){
        let uid = 1

        if(this.users.length != 0){
            uid = this.users.length + 1
        }

        user._id = 1
        user.isDeleted = false
        user.createdAt = new Date()
        user.updatedAt = new Date()

        this.users.push(user)

        return user
    }
}