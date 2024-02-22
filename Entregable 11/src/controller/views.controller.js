//import { productsController } from '../controller/products.controller.js'
//import { cartsController } from '../controller/carts.controller.js'
import { productsService } from '../services/products.service.js'
import { cartsService } from '../services/carts.service.js'

export class viewsController{
    constructor(){}

    static async home(req, res){
        res.setHeader('Content-Type', 'text/html')
        res.status(200).render('home')
    }

    static async products(req, res){
    
        //res.setHeader('Content-Type', 'text/html')
        
        let {limit, page, query, sort} = req.query

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

        let { totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } = products

        let user = req.session.user

        //let user = req.session.user

        //console.log( totalPages, hasPrevPage, hasNextPage, prevPage, nextPage )

        return res.status(200).render('products', {cartID: user.cart, products: products.docs, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage, limit, title:'Products'})
        
    }

    static async product(req, res){
        res.setHeader('Content-Type', 'text/html')

        let id = req.params.pid
    
        let product = await productsService.getProductByID(id)

        let user = req.session.user

        console.log(product)

        return res.status(200).render('product', {cartID: user.cart, product, title: product.title})
    }

    static async carts(req, res){
        res.setHeader('Content-Type', 'text/html')

        let carts = await cartsService.getCarts()
        res.status(200).render('carts',{carts, title:'Carts'})
    }

    static async cart(req, res){
        res.setHeader('Content-Type', 'text/html')

        let id = req.params.cid

        let cart = await cartsService.getCartByID(id)

        res.status(200).render('cart', {cart, title: `Cart ${cart._id}`})
    }

    static async login(req, res){
        
        let { error, message }  = req.query
    
        res.setHeader('Content-Type', 'text/html')
        res.status(200).render('login', {error, message})
    }

    static async register(req, res){
        
        let { error, message } = req.query 
    
        res.setHeader('Content-Type', 'text/html')
        res.status(200).render('register', {error})
    }


    static async profile(req, res){
        
        let user = req.session.user

        res.setHeader('Content-Type', 'text/html')
        res.status(200).render('profile', {user})
    }
}