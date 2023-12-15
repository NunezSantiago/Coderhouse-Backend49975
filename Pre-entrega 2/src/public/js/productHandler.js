const socket = io()
//const cartManager = require('./dao/cartManager_MONGO.js')

//let cm = new cartManager()



// Swal.fire({
//     title: "Ingrese un nombre",
//     input: "number",
//     text: "Nombre:",
//     inputValidator: (value) => {
//         return !value && "Por favor, ingrese su nombre."
//     },
//     allowOutsideClick: false
// }).then(result => {
//     let cartID = result.value

//     let addToCart = document.getElementsByClassName('addToCart')

//     let divProductos = document.getElementById("productos")
    
//     let divProductos = document.getElementById("productos")
//     divProductos.innerHTML = `${products}`

//     let productID
// })

async function addToCart(pid){
    // let divProductos = document.getElementById("productos")
    // divProductos.innerHTML = `${pid}`

    let cartID = document.getElementById('cartID').value

    // let divProductos = document.getElementById("productos")
    // divProductos.innerHTML = `${cartID}`

    let URL = `/api/carts/${cartID}/product/${pid}`
    // let divProductos = document.getElementById("productos")
    // divProductos.innerHTML = `${URL}`

    fetch(URL, {
        method: 'PUT',
        body: JSON.stringify({
            "quantity": 5
        })
    })


}

socket.on("connection", async (data)=>{
    //console.log('hola')
})

socket.on("new-product", data=>{
    let productos = data.products
    let divProductos = document.getElementById("productos")
    divProductos.innerHTML = ``
    productos.forEach(product => {
        let prod = document.createElement("div")
        prod.className = product.code
        prod.innerHTML = `
        <h3>${product.title}</h3>
        <p>${product.description}</p>
        <p>${product.price}</p>
        <hr>
        `
        divProductos.appendChild(prod)
    });
})