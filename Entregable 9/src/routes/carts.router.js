import { Router } from 'express';
import { cartsController } from "../controller/carts.controller.js";

export const router = Router()

router.get('/', cartsController.getCarts)
router.get('/:cid', cartsController.getCartByID)

router.post('/', cartsController.createCart)
router.post('/:cid/product/:pid', cartsController.addToCart)

router.delete('/:cid/product/:pid', cartsController.removeFromCart)