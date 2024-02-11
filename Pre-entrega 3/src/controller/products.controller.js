import { productsService } from "../services/products.service.js";

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
            return res.status(400).json({error: users.error.message})
        } else{
            //console.log(products)
            return res.status(200).json(products)
        }
    } // End Get

    static async getProductByID(req, res){

    }

    static async createProduct(req, res){

        res.setHeader("Content-Type", "application/json");

        let { title, description, code, price, stock, category, status, thumbnails } = req.body

        if(!title || !description || !code || !price || !stock || !category){
            return res.status(400).json({error: 'Product information is not complete, please, make sure to enter all necessary information'})
        }

        let exist = await productsService.getProductByCode(code)

        if(exist){
            return res.status(400).json({error: `Product with code  ${code} already exists`})
        }

        if(isNaN(stock) || isNaN(price)){
            return res.status(400).json({error: `Product information is not correct, please, make sure to enter all information in the correct format`})
        } 

        let product = {
            title: title,
            description: description,
            price: price,
            thumbnails: thumbnails ? thumbnails : [],
            code: code,
            stock: stock,
            category: category,
            status: (status && status === 'false') ? false : true
        }

        let newProduct = await productsService.createProduct(product)

        if(newProduct.error){
            return res.status(400).json({error: newProduct.error.message})
        } else {
            return res.status(200).send('Product successfully created')
        }
    } // End create

    static async updateProduct(req, res){

        res.setHeader("Content-Type", "application/json");

        let id = req.params.pid

        let exist = await productsService.getProductByID(id)

        if(!exist){
            return res.status(400).json({error: `Unable to find product with ID ${id}`})
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
                    return res.status(400).json({error: newProduct.error.message})
                } else if(Object.keys(params).length === lengthAux){
                    return res.status(200).send('Product successfully updated')
                }

                console.log(updatedProduct)

            }

            if(priceNaN || stockNaN || repeatedCode){

                let error = {}

                error.parametersCount = lengthAux
                error.commitedChanges = Object.keys(params).length
                
                if(priceNaN){
                    error.errorPrice = "Failed to update price. Provided value is not a number"
                }
                
                if(stockNaN){
                    error.errorStock = "Failed to update stock. Provided value is not a number"
                }

                if(repeatedCode){
                    error.errorCode = `Failed to update code. Already existing product with code ${code}`
                }

                return res.status(400).json(error)
            }
        }

        return res.status(400).json({error: "No modifiable values provided"})


    }

    static async deleteProduct(req, res){

        res.setHeader("Content-Type", "application/json")

        let id = req.params.pid

        let exist = await productsService.getProductByID(id)

        if(!exist){
            return res.status(400).json({error: `Unable to find product with ID ${id}`})
        }

        let deleteProduct = await productsService.deleteProduct(id)

        if(deleteProduct.error){
            return res.status(400).json({error: deleteProduct.error.message})
        } else{
            return res.status(200).send('Product successfully deleted')
        }
    }

    
}