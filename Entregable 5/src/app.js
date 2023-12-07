import express from 'express'
import routerProducts from './routes/products.router.js'
import {engine} from 'express-handlebars'
import __dirname from './utils.js';
import {router as viewRouter} from './routes/views.router.js'
import routerCarts from './routes/carts.router.js'
import {Server} from 'socket.io'
import mongoose from 'mongoose'

import { messagesModel } from './models/messages.model.js';

const PORT = 8080
const app = express()

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname+"/public"))


app.use('/', viewRouter)
app.use('/api/products', routerProducts) // Ruta productos localhost:8080/api/products
app.use('/api/carts', routerCarts) // Ruta productos localhost:8080/api/products

const server = app.listen(PORT, async ()=>{
    console.log('Server is online')
})

export const io = new Server(server)

io.on("connection", socket=>{
  console.log('Cliente conectado')

  socket.on('id', name=>{
    socket.broadcast.emit("newUser:" + name)
  })

  socket.on('message', async data => {
    try {
      await messagesModel.create(data)
    } catch (error) {
      console.log(error.message)
    }

    io.emit('newMessage', data)
  })
})

try {
  await mongoose.connect('mongodb+srv://nunezsantiago43:pass1234@coder49975.wmyvz3z.mongodb.net/?retryWrites=true&w=majority', {dbName: 'ecommerce'})
  console.log('Successfully connnected to database!!')
} catch (error) {
  console.log(error.message)
}