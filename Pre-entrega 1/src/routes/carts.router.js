const Router = require('express').Router
const ProductManager = require("../productManager");
const cartManager = require("../cartManager");

const router = Router()
const cm = new cartManager("./files/carritos.json");

router.get('/', async (req, res) => {

    

})

module.exports = router