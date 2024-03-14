import { Router } from 'express';
import { productsController } from '../controller/products.controller.js';

export const router = Router()

// No arguments provided. Same error is logged if any of the required attributes are not present.
router.get('/products/create1', async (req, res) => {
    let test = productsController.createProduct(req, res)
})

// Price is not a number. Similar error is logged if Stock is not a number.
router.get('/products/create2', async (req, res) => {
    req.body = {
        "title": "New title 2",
        "description": "New description",
        "price": "19asdas2",
        "thumbnails": [],
        "code": "AAA171",
        "stock": 5,
        "status": true,
        "category": "Testing category"
    }

    let test = productsController.createProduct(req, res)
})

// Product with specified code already exists.
router.get('/products/create3', async (req, res) => {
    req.body = {
        "title": "New title 2",
        "description": "New description",
        "price": 130,
        "thumbnails": [],
        "code": "AAA121",
        "stock": 5,
        "status": true,
        "category": "Testing category"
    }
    let test = productsController.createProduct(req, res)
})

// Product created successfully. (May need to change code)
router.get('/products/create4', async (req, res) => {
    req.body = {
        "title": "New title 2",
        "description": "New description",
        "price": 130,
        "thumbnails": [],
        "code": "EEE555",
        "stock": 5,
        "status": true,
        "category": "Testing category"
    }
    let test = productsController.createProduct(req, res)
})

// Could not find product with specified ID.
router.get('/products/update1', async (req, res) => {
    req.params.pid = '65b6c6804e5186d92f85c2ad'
    let test = productsController.updateProduct(req, res)
})

// Product exist but not attributes are provided. Same error if provided attributes cannot be modified or do not exist as those are filtered.
router.get('/products/update2', async (req, res) => {
    req.params.pid = '65b6c6804e5186d92f85c2ac'
    let test = productsController.updateProduct(req, res)
})

// Unable to update code as it is already being used by another product.
router.get('/products/update3', async (req, res) => {
    req.params.pid = '65b6c6804e5186d92f85c2ac'
    req.body.code = 'DDD444'
    let test = productsController.updateProduct(req, res)
})

// Unable to update price as value provided is not a number. Similar behavior if stock is not a number.
router.get('/products/update4', async (req, res) => {
    req.params.pid = '65b6c6804e5186d92f85c2ac'
    req.body.price = 'abc'
    let test = productsController.updateProduct(req, res)
})

// Product updated successfully
router.get('/products/update5', async (req, res) => {
    req.params.pid = '65b6c6804e5186d92f85c2ac'
    req.body.title = 'abc'
    let test = productsController.updateProduct(req, res)
})

// Could not find product with specified ID
router.get('/products/delete1', async (req, res) => {
    req.params.pid = '65b6c6804e5186d92f85c2ad'
    let test = productsController.updateProduct(req, res)
})

// Successful delete. (May need to use a different ID)
router.get('/products/update2', async (req, res) => {
    req.params.pid = '65b6c6804e5186d92f85c2ac'
    let test = productsController.updateProduct(req, res)
})