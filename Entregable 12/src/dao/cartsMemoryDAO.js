/*
    _id main id
    products - products in the cart {prod id, quantity}
    isDeleted
*/

export class cartsMemoryDAO{
    constructor(){
        this.carts = [
            {
                "_id": 1,
                "products": [
                    {
                        "product": {
                            "_id": 2,
                            "stock": 2,
                            "price": 192
                        },
                        "quantity": 4
                    },
                    {
                        "product": {
                            "_id": 1,
                            "stock": 2,
                            "price": 192
                        },
                        "quantity": 2
                    },
                    {
                        "product": {
                            "_id": 3,
                            "stock": 2,
                            "price": 192
                        },
                        "quantity": 1
                    }
                ],
                "isDeleted": false,
                "createdAt": "2024-02-11T14:30:02.604Z",
                "updatedAt": "2024-02-11T14:30:20.011Z"
            }
        ]
    }

    async get(){
        return this.carts.filter(cart => !cart.isDeleted)
    }

    async getByID(cid){
        return this.carts.find(cart => cart._id == cid && !cart.isDeleted)
    }

    // async getByCartID(cid){
    //     return this.carts.find(cart => cart.cartId = cid)
    // }

    async create(products){
        let cartID = 1

        if(this.carts.length != 0){
            cartID = this.carts.length + 1
        }

        let newCart = {
            _id: cartID,
            products,
            isDeleted: false,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        this.carts.push(newCart)

        return newCart

    }

    async update(cid, products){

        //console.log(cid)

        cid = parseInt(cid)

        //console.log(products)
        
        let indexOfCart = this.carts.findIndex(cart => cart._id == cid)

        // if(products.length > 1){
        //     let newProduct = products[products.length - 1]

        //     for(let i = 0; i < products.length - 1; i++){
        //         if(products[i].product == newProduct.product){
        //             products[i].quantity+=newProduct.quantity
        //             products.splice(products.length - 1, 1)
        //             break
        //         }
        //     }

        //     // for(let prod of products){
        //     //     if(prod.product == newProduct.product){
        //     //         prod.quantity+=newProduct.quantity
        //     //         products.splice(products.length - 1, 1)
        //     //         break
        //     //     }
        //     // }
        // }

        //console.log(products)

        

        //console.log(indexOfCart)

        this.carts[indexOfCart].products = products
        this.carts[indexOfCart].updatedAt = new Date()

        //console.log(this.carts[indexOfCart])

        return this.carts[indexOfCart]
    }

    async delete(cid){
        indexOfCart = this.carts.indexOf(cart => cart._id = cid)

        this.carts[indexOfCart].isDeleted = true
        this.carts[indexOfCart].updatedAt = new Date()

        return true
    }


}