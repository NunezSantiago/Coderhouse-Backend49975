const socket = io()

async function addToCart(pid){
    
    //let cartID = document.getElementById('cartID').value
    
    let cartID = session.user.cart

    console.log(cartID)
    
    // let URL = `/api/carts/${cartID}/product/${pid}`
    

    // fetch(URL, {
    //     method: 'PUT'
    // })


}

socket.on("connection", async (data)=>{
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