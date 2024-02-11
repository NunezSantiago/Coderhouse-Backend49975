import { Router } from 'express';
import { productsController } from '../controller/products.controller.js';

export const router = Router()

// Middlewars

const isAdmin = (req, res, next) => {
    if(!req.session.user){
        return res.status(403).json("Please, login as an admin")
    } else if(req.session.user.role != 'Admin'){
        return res.status(403).json("Unauthorized. Your account does not have enough privileges to access this resource.")
    }
    next()
}

router.get('/', productsController.getProducts)
router.post('/', isAdmin,productsController.createProduct)
router.put('/:pid', isAdmin, productsController.updateProduct)
router.delete('/:pid', isAdmin, productsController.deleteProduct)
