import { faker } from "@faker-js/faker";

export class productsMock{
    constructor(){}

    /*
        -Unique
        _id
        code
        -Strings
        name
        description
        category
        -Number
        price
        stock
        -Boolean
        status
        isDeleted
    */
    
    // Generates a number of products specified in the body.
    // Quantity default = 100
    static async generateProducts(quantity){
        let products = []

        quantity = !quantity || quantity <= 0 ? 100 : quantity

        // faker.commerce.price
        // faker.date.

        for(let i = 1; i <= quantity; i++){
            products.push({
                _id: i,
                code: faker.string.alphanumeric(8) + i,
                name: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                category: faker.commerce.department(),
                price: parseFloat(faker.commerce.price()),
                stock: faker.number.int(999),
                status: Math.random() < 0.5,
                isDeleted: Math.random() < 0.5,
                thumbnails: []
            })
        }

        console.log(products)

        return products
    }
}