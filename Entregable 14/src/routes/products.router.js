import { Router } from 'express';
import { productsController } from '../controller/products.controller.js';

export const router = Router()

// Middlewares

const isAdmin = (req, res, next) => {
    if(!req.session.user){
        return res.status(403).json({error: "Please, login as an administrator or premium user"})
    } else if(req.session.user.role != 'Admin' && req.session.user.role != 'Premium' ){
        return res.status(403).json({error: "Unauthorized. Your account does not have enough privileges to access this resource."})
    }
    next()
}

router.get('/', isAdmin, productsController.getProducts)
router.post('/', isAdmin, productsController.createProduct)
router.put('/:pid', isAdmin, productsController.updateProduct)
router.delete('/:pid', isAdmin, productsController.deleteProduct)
