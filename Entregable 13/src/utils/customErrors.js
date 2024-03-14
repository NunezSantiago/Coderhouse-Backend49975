// export class customError{

//     constructor(){}

//     static customError(name, message, statusCode, internalCode, description=""){
//         let error={name, message, statusCode, internalCode, description}
//         return error
//     }
// }

import os from 'os'

export class customError{

    constructor(){}

    static customError(name, message, statusCode, internalCode, description=""){
        
        let error=new Error()

        error.name = name
        error.message = message
        error.statusCode = statusCode
        error.internalCode = internalCode
        error.description = description
        error.date = new Date().toUTCString()
        error.user = os.userInfo().username

        return error
    }
}