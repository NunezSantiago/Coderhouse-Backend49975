import {Router} from 'express'
import productManager from '../dao/productManager_MONGO.js'
import cartManager from '../dao/cartManager_FS.js'
import __dirname from '../utils.js';

const pm = new productManager();
const cm = new cartManager(__dirname + "/files/carts.json")

export const router = Router()

router.get('/', async (req, res) => {
    let products = await pm.getProducts()

    res.status(200).render('home',{products, title:'Productos con handlebars'})
})

router.get('/realTimeProducts', async (req, res) => {
    let products = await pm.getProducts()
    console.log(products)
    res.status(200).render('realTimeProducts',{products: JSON.parse(JSON.stringify(products)), title:'Productos con websocket'}) // Workaround for error when only using products JSON.parse(JSON.stringify(products))
})

router.get('/carts', async (req, res) => {
    let carts = await cm.getCarts()
    console.log(carts)
    res.status(200).render('carts',{carts, title:'Carrito con websocket'})
})

router.get('/chat', async (req, res) => {
    res.status(200).render('chat')
})