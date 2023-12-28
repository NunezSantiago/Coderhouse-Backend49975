import { productsModel } from "../models/products.model.js";

class productManager{

	async getProducts(limit, page, query, sort){

		let products = []

		let conf = {
			lean: true,
			limit: limit ? parseInt(limit) : 10,
			page : page ? parseInt(page) : 1,
		}

		//conf.limit = 2 Testing pagination
	
		if(sort && (sort === 'asc' || sort === 'desc')){
			conf.sort = {price : sort}
		}

		if(query){
			query = JSON.parse(query)
			query.isDeleted = false
		} else{
			query = {isDeleted: false}
		}

		//console.log(query)
			
		try {
			products = await productsModel.paginate(query, conf)
		} catch (error) {
			console.log(error.message)
		}

		return products
	}

	async getProductByID(pid){
		let product
		try {
			product = await productsModel.findOne({id: pid, isDeleted: false}).lean()
		} catch (error) {
			return {error: 'Error inesperado', message: error.message}
		}

		//console.log(product)

		if(product){
			return product
		}
		else{
			console.log(`Not found element with ID ${pid}`)
			return false
		}
	}

	async getProductByObjectID(pid){
		let product
		try {
			product = await productsModel.findOne({_id: pid, isDeleted: false}).lean()
		} catch (error) {
			return {error: 'Error inesperado', message: error.message}
		}

		//console.log(product)

		if(product){
			return product
		}
		else{
			console.log(`Not found element with ID ${pid}`)
			return false
		}
	}
	
	async addProducts(newProduct){

		let existing

		try {
			existing = await productsModel.findOne({code: newProduct.code, isDeleted: false})
		} catch (error) {
			return {error: 'Error inesperado', message: error.message}
		}
		
		let id

		try {
			id = await productsModel.find().sort({id:-1}).limit(1)

			id = id[0] ? id[0].id + 1 : 1
			//console.log(id)
		} catch (error) {
			return {error: 'Error inesperado', message: error.message}
		}

		if(!existing){
			try {
				newProduct.id = id
				let prod = await productsModel.create(newProduct)
				return prod
			} catch (error) {
				return {error: 'Error inesperado', message: error.message}
			}
		}else{
			console.log(`Already exisiting product with code  ${newProduct.code}`);
			return false
		}
	}

	async updateProduct(pid, parameters){

		if(!await this.getProductByID(pid)){
			console.log(`Not found element with ID ${pid}`)
			return {status: 'failed', error: `Not found element with ID ${pid}`}
		}

		let {title, description, price, thubnails, code, stock, category, status} = parameters

		let parametersAux = {title, description, price, thubnails, code, stock, category, status}

		Object.keys(parametersAux).forEach((key) => {
			if(parametersAux[key] === undefined){
				delete parametersAux[key]
			}
		})

		if(Object.keys(parametersAux).length !== 0){

			let repeatedCode = false
			let priceNaN = false
			let stockNaN = false
						
			if(parametersAux['code']){

				let existing

				try {
					existing = await productsModel.findOne({code: parametersAux['code']})
				} catch (error) {
					return {error: 'Error inesperado', message: error.message}
				}

				if(existing){
					delete parametersAux['code']
					repeatedCode = true
				}

			}

			if(parametersAux['price'] && isNaN(parametersAux['price'])){
				delete parametersAux['price']
				priceNaN = true
			}

			if(parametersAux['stock'] && isNaN(parametersAux['stock'])){
				delete parametersAux['stock']
				stockNaN = true
			}

			if(Object.keys(parametersAux).length !== 0){
				//console.log('entra?')
				try {
					await productsModel.updateOne({id: pid, isDeleted: false}, parametersAux)
				} catch (error) {
					return {status:'failed', error: 'Unexpected error'}
				}

				if(repeatedCode){
					return {status: 'Partial success', error: 'Operation partially successful. Code could not be updated because there is another object with the same code.'}
				} else if(priceNaN){
					return {status: 'Partial success', error: 'Operation partially successful. Provided price value is not a number.'}
				} else if(stockNaN){
					return {status: 'Partial success', error: 'Operation partially successful. Provided stock value is not a number.'}
				}

			} else {
				if(repeatedCode){
					return {status: 'failed', error: 'Code could not be updated because there is another product with the same Code'}
				} if(priceNaN){
					return {status: 'failed', error: 'Provided price value is not a number.'}
				} else if(stockNaN){
					return {status: 'failed', error: 'Provided stock value is not a number.'}
				}
			}
		} else {
			return {status: 'failed', error: 'Attributes provided cannot be changed.'}
		}
	}

	async deleteProduct(pid){

		if(!await this.getProductByID(pid)){
			console.log(`Not found element with ID ${pid}`)
			return {status: 'failed', error: `Not found element with ID ${pid}`}
		} else{

			try {
				await productsModel.updateOne({id: pid, isDeleted: false}, {isDeleted: true})
			} catch (error) {
				return {status:'failed', error: 'Unexpected error'}
			}

			return true
		}

	}

} // productManager



export default productManager

