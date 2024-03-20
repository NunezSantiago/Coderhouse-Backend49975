import { Router } from 'express';
import { productsMock } from '../mocks/products.mock.js';

export const router = Router()

router.get('/mockingProducts', async (req, res) => {
    res.setHeader("Content-Type", "application/json");

    let products = await productsMock.generateProducts(req.body.quantity)

    return res.status(200).json(products)
})