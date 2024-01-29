import { Router } from 'express';
import { productsController } from '../controller/products.controller.js';

export const router = Router()

router.get('/', productsController.getProducts)
router.post('/', productsController.createProduct)
router.put('/:pid', productsController.updateProduct)
router.delete('/:pid', productsController.deleteProduct)
