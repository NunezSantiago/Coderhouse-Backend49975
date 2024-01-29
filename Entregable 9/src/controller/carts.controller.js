import { cartsService } from "../services/carts.service.js";
import { productsService } from "../services/products.service.js";

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

        let id = req.params.cid

        let cart = await cartsService.getCartByID(id)

        if(cart.error){
            return res.status(400).json({error: cart.error.message})
        } else{
            return res.status(200).json(cart)
        }
    }

    static async createCart(req, res){

        res.setHeader("Content-Type", "application/json");

        let { products } = req.body
    
        let availableProducts = await productsService.getAllProducts()
        
        if(availableProducts.error){
            return res.status(400).json({error: availableProducts.error.message})
        }

        let cart = []
        
        let productsIds = availableProducts.map(product => product._id.toString())
        
        products.forEach( (product) => {
            if(productsIds.includes(product)){
                cart.push({product, quantity: 1})
            }
        })

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

        let existCart = await cartsService.getCartByID(cartId)
        let existProduct = await productsService.getProductByID(productId)

        if(existCart && !existCart.error){
            if(existProduct && !existProduct.error){

                //Both cart and products exist

                let cart = existCart.products
                let productinCart = false

                for(let prod of cart){
                    console.log(prod)
                    if(prod.product == productId){
                        prod.quantity+=quantity
                        productinCart = true
                        break
                    }
                }

                if(!productinCart){
                    cart.push({product: productId, quantity})
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
}