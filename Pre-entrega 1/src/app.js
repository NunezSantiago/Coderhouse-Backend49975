const productManager = require("./productManager")
const cartManager = require("./cartManager")
const routerProducts = require('./routes/products.router')
const routerCarts = require('./routes/carts.router')
const express = require('express')

const PORT = 8080
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get("/", (req, res) => { // Ruta inicio localhost:8080/
    res.setHeader("Content-Type", "text/plain");
    res.status(200).send('OK');
    
  });

app.use('/api/products', routerProducts) // Ruta productos localhost:8080/api/products
app.use('/api/carts', routerCarts) // Ruta carritos localhost:8080/api/carts

const server = app.listen(PORT, async ()=>{
    console.log('Server is online')
})