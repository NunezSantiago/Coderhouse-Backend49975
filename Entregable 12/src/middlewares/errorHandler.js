export const errorHandler = (error, req, res , next) => {
    
    console.log("Middleware executed")

    if(error){
        if(error.internalCode){

            console.log(`
            Error code: ${error.statusCode}
            Internal code: ${error.internalCode}
            Error name: ${error.name}
            Message: ${error.message}
            Description: ${error.description}
            `)

            res.setHeader("Content-Type", "application/json");
            return res.status(error.statusCode).json({error: `Error: ${error.name}: ${error.message}`})
        } else {
            res.setHeader("Content-Type", "application/json");
            return res.status(500).json({error: "Server error. Please, contact your administrator"})
        }
    }

    next()
}