import { cartsService } from "../services/carts.service.js";
import { productsService } from "../services/products.service.js";
import { ticketsService } from "../services/ticket.service.js";

export class cartsController{

    constructor(){}

    static async getCarts(req, res){
        res.setHeader("Content-Type", "application/json");

        let carts = await cartsService.getCarts()

        if(carts.error){
            return res.status(400).json({error: carts.error.message})
        } else{
            return res.status(200).json(carts)
        }

    }

    static async getCartByID(req, res){
        res.setHeader("Content-Type", "application/json");

        let cartId = req.params.cid

        let cart = await cartsService.getCartByID(cartId)

        if(cart){
            if(cart.error){
                return res.status(400).json({error: cart.error.message})
            } else{
                return res.status(200).json(cart)
            }
        } else{
            return res.status(400).json({error: `Could not find cart with ID ${cartId}`})
        }

        // if(cart.error){
        //     return res.status(400).json({error: cart.error.message})
        // } else{
        //     return res.status(200).json(cart)
        // }
    }

    static async createCart(req, res){

        res.setHeader("Content-Type", "application/json");

        let { products } = req.body
    
        let cart = []
        
        if(products){
            let availableProducts = await productsService.getAllProducts()
        
            if(availableProducts.error){
                return res.status(400).json({error: availableProducts.error.message})
            }

            let productsIds = availableProducts.map(product => product._id.toString())
            
            products.forEach( (product) => {
                if(productsIds.includes(product)){
                    cart.push({product, quantity: 1})
                }
            })
        }

        let newCart = await cartsService.createCart(cart)

        if(newCart.error){
            return res.status(400).json({error: newCart.error.message})
        } else{
            res.status(200).json("Cart added successfully")
        }
    }

    static async addToCart(req, res){
        
        res.setHeader("Content-Type", "application/json");
        
        let cartId = req.params.cid
        let productId = req.params.pid

        let quantity = (req.body.quantity && !isNaN(req.body.quantity)) ? req.body.quantity : 1
        quantity = parseInt(quantity)

        //console.log(quantity)

        let existCart = await cartsService.getCartByID(cartId)
        let existProduct = await productsService.getProductByID(productId)

        if(req.session.user.role == "Premium" && existProduct.owner != req.session.user.email){
            let error = customError.customError("Cannot add product", `Premium users cannot add products owned by them to the cart`, STATUS_CODES.ERROR_AUTORIZACION, INTERNAL_CODES.PERMISSIONS, `Cannot add  product with id ${productId}`)
            req.logger.error(error)
            return res.status(error.statusCode).json(error)
        }

        if(existCart && !existCart.error){
            if(existProduct && !existProduct.error){

                //Both cart and products exist

                let cart = existCart.products
                let productinCart = false
                
                for(let prod of cart){
                    //console.log(prod)
                    if(prod.product._id == productId){
                        prod.quantity+=quantity
                        productinCart = true
                        break
                    }
                }

                if(!productinCart){
                    cart.push({product: {
                        _id: existProduct._id,
                        stock: existProduct.stock,
                        price: existProduct.price
                    }, quantity})
                }

                let updatedCart = await cartsService.updateCart(cartId, cart)

                if(updatedCart.error){
                    return res.status(400).json({error: updatedCart.error.message})
                } else{
                    return res.status(200).json(`Successfully added product ${productId} to cart ${cartId}`)
                }

            } else{
                return res.status(400).json({error: `Could not find product with ID ${productId}`})
            }
        } else{
            return res.status(400).json({error: `Could not find cart with ID ${cartId}`})
        }

    }

    static async removeFromCart(req, res){
        
        res.setHeader("Content-Type", "application/json");

        let cartId = req.params.cid
        let productId = req.params.pid

        let existCart = await cartsService.getCartByID(cartId)
        let existProduct = await productsService.getProductByID(productId)

        if(existCart && !existCart.error){
            if(existProduct && !existProduct.error){

                let cart = existCart.products
                
                let newCart = cart.filter( p => p.product != productId)

                if(newCart.length === cart.length){
                    // Product was not in cart
                    res.status(400).json({error: `Product ${productId} is not in cart ${cartId}`})
                } else {
                    let updatedCart = cartsService.updateCart(cartId, newCart)
                    
                    if(updatedCart.error){
                        return res.status(400).json({error: updatedCart.error.message})
                    } else{
                        return res.status(200).json(`Successfully deleted product ${productId} to cart ${cartId}`)
                    }

                }

            } else{
                return res.status(400).json({error: `Could not find product with ID ${productId}`})
            }
        } else{
            return res.status(400).json({error: `Could not find cart with ID ${cartId}`})
        }

    }

    static async finalizePurchase(req, res){
        
        res.setHeader("Content-Type", "application/json");

        let cartId = req.params.cid

        let cart = await cartsService.getCartByID(cartId)

        if(cart){

            let amount = 0
            let available = [] // Keep a list of the available products, to update later
            let unavailable = []

            cart.products.forEach( prod => {
                if(prod.quantity <= prod.product.stock){
                    available.push(prod)
                    amount+=(parseFloat(prod.product.price*prod.quantity))
                } else {
                    unavailable.push(prod._id)
                }
            })

            if(available.length > 0){
                
                let ticket
                let purchaser = cart._id
                let purchase_datetime = new Date()

                // Random code generator
                let code
                let unique = false

                do{
                    code = (Math.random() + 1).toString(36).substring(2) + (Math.random() + 1).toString(36).substring(2);
                    ticket = await ticketsService.getTicketByCode(code) 
                    if(!ticket){
                        unique = true
                    }
                } while(!unique)

                let result = await ticketsService.createTicket({code, purchase_datetime, amount, purchaser})

                let newCart = cart

                let availableIDs = available.map(avail => avail.product._id)

                for(let i = newCart.products.length - 1; i >= 0; i--){
                    if(availableIDs.includes(newCart.products[i].product._id)){
                        newCart.products.splice(i, 1)
                    }
                }

                console.log(newCart.products)

                let updateCart = await cartsService.updateCart(cartId, newCart.products)
                
                available.forEach(async prod => {
                    //prod.product.stock-=prod.quantity
                    await productsService.updateProduct(prod.product._id, {stock: prod.product.stock - prod.quantity})
                })

                res.status(200).json(result)
            } else{
                res.status(200).json("None of the selected products were available for purchase")
            }

        } else{
            return res.status(400).json({error: `Could not find cart with ID ${cartId}`})
        }
    }
}