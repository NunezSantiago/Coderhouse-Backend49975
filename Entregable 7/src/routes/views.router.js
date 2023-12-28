import {Router} from 'express'
import productManager from '../dao/productManager_MONGO.js'
import cartManager from '../dao/cartManager_MONGO.js'
import __dirname from '../utils.js';

const pm = new productManager();
const cm = new cartManager()

const auth = (req, res, next) => {
    if(!req.session.user){
        return res.redirect('/login')
    }
    next()
}

export const router = Router()

router.get('/', auth, async (req, res) => {
    //let products = await pm.getProducts()

    res.status(200).render('home',{name: req.session.user.username})
})

router.get('/products', auth, async (req, res) => {
    let {limit, page, query, sort} = req.query

    let products = await pm.getProducts(limit, page, query, sort)

    let { totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } = products

    let user = req.session.user

    //console.log( totalPages, hasPrevPage, hasNextPage, prevPage, nextPage )

    res.status(200).render('products',{user, products: products.docs, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage, limit, title:'Productos'})
})

router.get("/product/:pid", auth, async (req, res) => {

    let id = req.params.pid
    
    let product = await pm.getProductByObjectID(id)
    
    //console.log(product)
    
    res.status(200).render('product', {product, title: product.title})
})

router.get('/cart/:cid', async (req, res) => {
    
    let id = req.params.cid

    let cart = await cm.getCartByID(parseInt(id))

    console.log(cart.products)

    res.status(200).render('cart', {products: cart.products, title: `Cart ${cart.id}`})
})

router.get('/carts', async (req, res) => {
    let carts = await cm.getCarts()
    //console.log(carts)
    res.status(200).render('carts',{carts, title:'Carrito'})
})

router.get('/chat', async (req, res) => {
    res.status(200).render('chat')
})

router.get('/logon', (req, res) => {

    let { error }  = req.query
    
    res.setHeader('Content-Type', 'text/html')
    res.status(200).render('logon', {error})
})


router.get('/login', (req, res) => {

    let { error, message } = req.query 
    
    res.setHeader('Content-Type', 'text/html')
    res.status(200).render('login', {error, message})
})

router.get('/profile', auth, (req, res) => {

    let user = req.session.user

    //console.log(user)
    
    res.setHeader('Content-Type', 'text/html')
    res.status(200).render('profile', {user})
})

