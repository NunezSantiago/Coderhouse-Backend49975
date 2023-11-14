import {Router} from 'express'
import productManager from '../productManager.js'
import __dirname from '../utils.js';

const pm = new productManager(__dirname + "/files/productos.json");

export const router = Router()

router.get('/', async (req, res) => {
    let products = await pm.getProducts()

    res.status(200).render('home',{products, title:'Productos con handlebars'})
})

router.get('/realTimeProducts', async (req, res) => {
    let products = await pm.getProducts()
    res.status(200).render('realTimeProducts',{products, title:'Productos con websocket'})
})