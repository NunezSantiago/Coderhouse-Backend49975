class ProductManager {

  constructor() {

    this.products = []

  }

  addProduct(title, description, price, thumbnail, code, stock) {

    let id = this.products.length == 0 ? 1 : this.products[this.products.length - 1].id + 1

    let existing = this.products.some((product) => product.code === code)

    if(title == undefined){

        console.log("Please add a title")

    } else if(description == undefined){

        console.log("Please add a description")

    } else if(price == undefined){

        console.log("Please add a price")

    } else if(thumbnail == undefined){

        console.log("Please add a thumbnail")

    } else if(code == undefined){

        console.log("Please add a code")

    } else if(stock == undefined){

        console.log("Please add stock")

    } else if (existing) {

      console.log(`Already exisiting product with code  ${code}`);

    } else {
        
      let newProduct = {
        id,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      };

      this.products.push(newProduct)
    }
  }

  getProducts() {
    return this.products
  }

  getProductById(id) {
    let elem = this.products.find((product) => product.id === id)
    
    if(elem){
        return elem
    }
    else{
        console.log(`Not found element with ID ${id}`)
    }
  }
}

//Crear instancia de Productanager
let testing = new ProductManager()

//Mostrar lista de productos (vacia)
let products = testing.getProducts()
console.log(products)

//Añadir un elemento con codigo "abc123"
testing.addProduct(
  "Producto prueba",
  "Este es un producto prueba",
  200,
  "Sin Imagen",
  "abc123",
  25
)

//Mostrar lista de productos (1)
products = testing.getProducts()
console.log(products)

//Agregar un elemento con el mismo codigo que el anterior (error)
testing.addProduct(
  "Producto prueba",
  "Este es un producto prueba",
  200,
  "Sin Imagen",
  "abc123",
  25
)

//Mostrar lista de productos (1)
products = testing.getProducts()
console.log(products)

//Añadir un elemento con codigo "abc1234"
testing.addProduct(
  "Producto prueba",
  "Este es un producto prueba",
  200,
  "Sin Imagen",
  "abc1234",
  25
)

//Mostrar lista de productos (2)
products = testing.getProducts()
console.log(products)

//Buscar el producto con ID 1 (existe)
let producto1 = testing.getProductById(1)
console.log(producto1)

//Buscar el producto con ID 2 (existe)
let producto2 = testing.getProductById(2)
console.log(producto2)

//Buscar el producto con ID 3 (no existe) => producto3 == undefined
let producto3 = testing.getProductById(3)
console.log(producto3)