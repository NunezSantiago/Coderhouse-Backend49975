import express from 'express'
import routerProducts from './routes/products.router.js'
import {engine} from 'express-handlebars'
import __dirname from './utils.js';
import {router as viewRouter} from './routes/views.router.js'
import {Server} from 'socket.io'

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

const server = app.listen(PORT, async ()=>{
    console.log('Server is online')
})

export const io = new Server(server)

io.on("connection", socket=>{
  console.log('Cliente conectado')
})