export class productsMemoryDAO{
    
    constructor(){
        this.products = [
            {
                "title": "New title 2",
                "description": "New description",
                "price": 192,
                "thumbnails": [],
                "code": "AAA111",
                "stock": 2,
                "category": "Testing category",
                "status": true,
                "_id": 1,
                "isDeleted": false,
                "createdAt": "2024-02-11T00:31:23.901Z",
                "updatedAt": "2024-02-11T00:31:23.901Z"
            },
            {
                "title": "New title 2",
                "description": "New description",
                "price": 192,
                "thumbnails": [],
                "code": "BBB222",
                "stock": 2,
                "category": "Testing category",
                "status": true,
                "_id": 2,
                "isDeleted": false,
                "createdAt": "2024-02-11T00:31:45.866Z",
                "updatedAt": "2024-02-11T00:31:45.866Z"
            },
            {
                "title": "New title 2",
                "description": "New description",
                "price": 192,
                "thumbnails": [],
                "code": "CCC333",
                "stock": 2,
                "category": "Testing category",
                "status": true,
                "_id": 3,
                "isDeleted": false,
                "createdAt": "2024-02-11T00:32:01.516Z",
                "updatedAt": "2024-02-11T00:32:01.516Z"
            }
        ]
    }

    //Patch
    async get(conf, query){
        return {docs: this.products.filter(product => !product.isDeleted)}
    }
    
    async getAll(){
        return this.products.filter(product => !product.isDeleted)
    }

    async getByID(pid){
        return this.products.find(product => product._id == pid && !product.isDeleted)
    }
    
    async getByCode(code){
        return this.products.find(product => product.code == code && !product.isDeleted)
    }

    async create(product){
        let productID = 1

        if(this.products.length != 0){
            productID == this.products.length + 1
        }

        product._id = productID

        product.isDeleted = false

        product.createdAt = new Date()
        product.updatedAt = new Date()

        this.products.push(product)

        return product
    }

    async update(pid, params){

        let paramsKeys = Object.keys(params)

        let indexOfProduct = this.products.findIndex(product => product._id == pid)

        paramsKeys.forEach(key => this.products[indexOfProduct][key] = params[key])

        this.products[indexOfProduct].updatedAt = new Date()

        return this.products[indexOfProduct]
    }

    async delete(pid){
        let indexOfProduct = this.products.findIndex(product => product._id == pid)

        this.products[indexOfProduct].isDeleted = true

        this.products[indexOfProduct].updatedAt = new Date()

        return this.products[indexOfProduct]
    }
}