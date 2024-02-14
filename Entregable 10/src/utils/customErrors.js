export class customError{

    constructor(){}

    static customError(name, message, statusCode, internalCode, description=""){
        let error=new Error(message)

        error.name = name
        error.statusCode = statusCode
        error.internalCode = internalCode
        error.description = description

        return error
    }
}