import {Router} from 'express'
import productManager from '../dao/productManager_MONGO.js'
import cartManager from '../dao/cartManager_MONGO.js'
import __dirname from '../utils.js';

const pm = new productManager();
const cm = new cartManager()

export const router = Router()

router.get('/', async (req, res) => {
    let products = await pm.getProducts()

    res.status(200).render('home',{products: products.docs, title:'Productos con handlebars'})
})

router.get('/products', async (req, res) => {
    let {limit, page, query, sort} = req.query

    let products = await pm.getProducts(limit, page, query, sort)

    let { totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } = products

    //console.log( totalPages, hasPrevPage, hasNextPage, prevPage, nextPage )

    res.status(200).render('products',{products: products.docs, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage, title:'Productos'})
})

router.get("/product/:pid", async (req, res) => {

    let id = req.params.pid

    let product = await pm.getProductByObjectID(id)

    console.log(product)

    res.status(200).render('product', {product, title: product.title})
})

router.get('/carts', async (req, res) => {
    let carts = await cm.getCarts()
    //console.log(carts)
    res.status(200).render('carts',{carts, title:'Carrito con websocket'})
})

router.get('/chat', async (req, res) => {
    res.status(200).render('chat')
})