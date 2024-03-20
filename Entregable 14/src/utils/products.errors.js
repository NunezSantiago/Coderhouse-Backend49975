import os from 'os'

// export const productArgsError = (product) => {
//     return `
//         Argument error.
//         Mandatory arguments:
//         - name: String | received ${product.name}
//         - code: String | received ${product.code}
//         - description: String | received ${product.description}
//         - category: String | received ${product.category}
//         - price: Number | received ${product.price}
//         - stock: Number | received ${product.stock}
//         Optional arguments
//         - status: Boolean (default True) | received ${product.status}
//         - thumbnails: Array (default []) | received ${product.thumbnails}

//         Date: ${new Date().toUTCString()}
//         User: ${os.userInfo().username}
//     `
// }

export class productErrors{
    constructor(){}

    static productArgsError(product){
        return `
        Argument error.
        Mandatory arguments:
        - name: String | received ${product.name}
        - code: String | received ${product.code}
        - description: String | received ${product.description}
        - category: String | received ${product.category}
        - price: Number | received ${product.price}
        - stock: Number | received ${product.stock}
        Optional arguments
        - status: Boolean (default True) | received ${product.status}
        - thumbnails: Array (default []) | received ${product.thumbnails}
    `
    }

    static productCodeError(code, id){
        return `Code error: Code: ${code} is already used by product with id: ${id}`
    }

    static priceNaN(price){
        return `Value provided for price is not a number. Received: ${price}`
    }

    static stockNaN(stock){
        return `Value provided for stock is not a number. Received: ${stock}`
    }

    static productIDNotFound(id){
        return `Unable to find product with ID: ${id} in the database`
    }

    static productCodeNotFound(code){
        return `Unable to find product with Code: ${code} in the database`
    }
}