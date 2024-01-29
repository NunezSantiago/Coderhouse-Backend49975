import {Router} from 'express'
import { viewsController } from '../controller/views.controller.js'

export const router = Router()

router.get('/', viewsController.home)

router.get('/products', viewsController.products)
router.get('/product/:pid', viewsController.product)

router.get('/carts', viewsController.carts)
router.get('/cart/:cid', viewsController.cart)

