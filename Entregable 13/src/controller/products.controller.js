import { productsService } from "../services/products.service.js";
import { customError } from "../utils/customErrors.js";
import { STATUS_CODES } from "../utils/errorCodes.js";
import { INTERNAL_CODES } from "../utils/errorCodes.js";
//import { productArgsError } from "../utils/products.errors.js";
import { productErrors } from "../utils/products.errors.js";

export class productsController{
    
    constructor(){}

    static async getProducts(req, res){

        res.setHeader("Content-Type", "application/json");
        
        let {limit, page, query, sort} = req.body

        let conf = {
			lean: true,
			limit: limit ? parseInt(limit) : 10,
			page : page ? parseInt(page) : 1,
		}

        if(sort && (sort === 'asc' || sort === 'desc')){
			conf.sort = {price : sort}
		}

        if(query){
			query = JSON.parse(query)
			query.isDeleted = false
		} else{
			query = {isDeleted: false}
		}

        let products = await productsService.getProducts(conf, query)

        if(products.error){
            let error = customError.customError("Database unexpected error", products.error.message, STATUS_CODES.ERROR_ARGUMENTOS, INTERNAL_CODES.DATABASE, "Database unexpected error, please, retry later")
            req.logger.error(error)
            //throw error
            return res.status(error.statusCode).json(error)
        } else{
            //console.log(products)
            return res.status(200).json(products)
        }
    } // End Get

    // static async getProductByID(req, res){

    // }

    static async createProduct(req, res){

        //res.setHeader("Content-Type", "application/json");

        let { title, description, code, price, stock, category, status, thumbnails } = req.body

        if(!title || !description || !code || !price || !stock || !category){
                          
            let error = customError.customError("Not enough information", "Product information is not complete, please, make sure to enter all necessary information", STATUS_CODES.ERROR_ARGUMENTOS, INTERNAL_CODES.ARGUMENTS, productErrors.productArgsError({title, description, code, price, stock, category, status, thumbnails}))
            req.logger.error(error)
            return res.status(error.statusCode).json(error)            
        }

        let exist = await productsService.getProductByCode(code)

        if(exist){
            let error = customError.customError("Code already exists", `Product with code: ${code} is already registered`, STATUS_CODES.ERROR_DATOS_ENVIADOS, INTERNAL_CODES.ARGUMENTS, productErrors.productCodeError(code, exist._id))
            req.logger.error(error)
            return res.status(error.statusCode).json(error)
        }

        if(isNaN(stock)){
            let error = customError.customError("Stock is not a number", "Stock value provided must be a numeric value", STATUS_CODES.ERROR_DATOS_ENVIADOS, INTERNAL_CODES.ARGUMENTS, productErrors.stockNaN(stock))
            req.logger.error(error)
            return res.status(error.statusCode).json(error)
        }
        
        if(isNaN(price)){
            let error = customError.customError("Price is not a number", "Price value provided must be a numeric value", STATUS_CODES.ERROR_DATOS_ENVIADOS, INTERNAL_CODES.ARGUMENTS, productErrors.priceNaN(price))
            req.logger.error(error)
            return res.status(error.statusCode).json(error)
        }

        if(!status){
            req.logger.warning("No status value provided or provided value is not 'true' or 'false', hence, defaulting to true")
        }

        let product = {
            title: title,
            description: description,
            price: price,
            thumbnails: thumbnails ? thumbnails : [],
            code: code,
            stock: stock,
            category: category,
            status: (status && status === 'false') ? false : true,
            owner: req.session.user.email
        }

        let newProduct = await productsService.createProduct(product)

        console.log(newProduct.error)

        if(newProduct.error){
            let error = customError.customError("Database unexpected error", newProduct.error.message, STATUS_CODES.ERROR_ARGUMENTOS, INTERNAL_CODES.DATABASE, "Database unexpected error, please, retry later")
            req.logger.error(error)
            return res.status(error.statusCode).json(error)
        } else {
            req.logger.info("Product created successfully")
            return res.status(200).send('Product successfully created')
        }
    } // End create

    static async updateProduct(req, res){

        res.setHeader("Content-Type", "application/json");

        let id = req.params.pid

        let exist = await productsService.getProductByID(id)

        if(!exist){
            let error = customError.customError("Product not found", `Unable to find product with ID ${id}`, STATUS_CODES.NOT_FOUND, INTERNAL_CODES.DATABASE, productErrors.productIDNotFound(id))
            req.logger.error(error)
            return res.status(error.statusCode).json(error)
            //throw error
            //return res.status(400).json({error: `Unable to find product with ID ${id}`})
        }

        console.log(exist)
        console.log(req.session.user)

        if(req.session.user.role == "Premium" && exist.owner != req.session.user.email){
            let error = customError.customError("Cannot edit product", `Premium users can only edit products owned by them`, STATUS_CODES.ERROR_AUTORIZACION, INTERNAL_CODES.PERMISSIONS, `Cannot edit product with id ${id}`)
            req.logger.error(error)
            return res.status(error.statusCode).json(error)
        }

        let { title, description, price, thubnails, code, stock, category, status } = req.body

        let params = { title, description, price, thubnails, code, stock, category, status }

        Object.keys(params).forEach((key) => {
			if(params[key] === undefined){
				delete params[key]
			}
		})

        if(Object.keys(params).length !== 0){

            let lengthAux =  Object.keys(params).length
         
            //New price is a number validation
			let priceNaN = false
            if(params['price'] && isNaN(params['price'])){
                delete params['price']
				priceNaN = true
			}
            
			//New stock is a number validation
            let stockNaN = false
            if(params['stock'] && isNaN(params['stock'])){
				delete params['stock']
				stockNaN = true
			}

            // New code already exists validation
            let repeatedCode = false
            if(params['code']){

                let exist = productsService.getProductByCode(code)

                if(exist){
                    delete params['code']
					repeatedCode = true
                }
            }

            let updatedProduct

            if(Object.keys(params).length !== 0){
                updatedProduct = await productsService.updateProduct(id, params)

                //console.log(params)

                if(updatedProduct.error){
                    let error = customError.customError("Database unexpected error", updatedProduct.error.message, STATUS_CODES.ERROR_ARGUMENTOS, INTERNAL_CODES.DATABASE, "Database unexpected error, please, retry later")
                    req.logger.error(error)
                    return res.status(error.statusCode).json(error)
                } else if(Object.keys(params).length === lengthAux){
                    req.logger.info("Product updated successfully")
                    return res.status(200).send('Product successfully updated')
                }

                //console.log(updatedProduct)

            }

            if(priceNaN || stockNaN || repeatedCode){

                let argumentsError = {}

                argumentsError.parametersCount = lengthAux
                argumentsError.commitedChanges = Object.keys(params).length
                
                if(priceNaN){
                    argumentsError.errorPrice = "Failed to update price. Provided value is not a number"
                }
                
                if(stockNaN){
                    argumentsError.errorStock = "Failed to update stock. Provided value is not a number"
                }

                if(repeatedCode){
                    argumentsError.errorCode = `Failed to update code. Already existing product with code ${code}`
                }

                let error = customError.customError("Partial success", `Unable to update wrongly formated inputs`, STATUS_CODES.ERROR_ARGUMENTOS, INTERNAL_CODES.ARGUMENTS, argumentsError)

                req.logger.error(error)

                return res.status(error.statusCode).json(error)

                //return res.status(400).json(error)
            }
        }

        let error = customError.customError("No modifiables values provided", `Parameters provided are not in the modifiable attributes list or they do not exist`, STATUS_CODES.ERROR_ARGUMENTOS, INTERNAL_CODES.ARGUMENTS, "Parameters provided are not in the modifiable attributes list or they do not exist")

        req.logger.error(error)

        return res.status(error.statusCode).json(error)

        //return res.status(400).json({error: "No modifiable values provided"})


    }

    static async deleteProduct(req, res){

        res.setHeader("Content-Type", "application/json")

        let id = req.params.pid

        let exist = await productsService.getProductByID(id)

        if(!exist){
            let error = customError.customError("Product not found", `Unable to find product with ID ${id}`, STATUS_CODES.NOT_FOUND, INTERNAL_CODES.DATABASE, productErrors.productIDNotFound(id))
            req.logger.error(error)
            return res.status(error.statusCode).json(error)
        }

        if(req.session.user.role == "Premium" && exist.owner != req.session.user.email){
            let error = customError.customError("Cannot delete product", `Premium users can only delete products owned by them`, STATUS_CODES.ERROR_AUTORIZACION, INTERNAL_CODES.PERMISSIONS, `Cannot delete product with id ${id}`)
            req.logger.error(error)
            return res.status(error.statusCode).json(error)
        }

        let deleteProduct = await productsService.deleteProduct(id)

        if(deleteProduct.error){
            let error = customError.customError("Database unexpected error", deleteProduct.error.message, STATUS_CODES.ERROR_ARGUMENTOS, INTERNAL_CODES.DATABASE, "Database unexpected error, please, retry later")
            req.logger.error(error)
            return res.status(error.statusCode).json(error)
        } else{
            req.logger.info("Product deleted successfully")
            return res.status(200).send('Product successfully deleted')
        }
    }

    
}