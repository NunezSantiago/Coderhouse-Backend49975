// Utilities
import __dirname from './utils.js'; //Utils

// Express
import express from 'express'
import {engine} from 'express-handlebars'
import sessions from 'express-session'

import { router as usersRouter } from './routes/users.router.js'
import { router as productsRouter } from './routes/products.router.js';
import { router as cartsRouter } from './routes/carts.router.js';
import { router as viewsRouter } from './routes/views.router.js';
import { router as sessionsRouter } from './routes/session.router.js';


// Mongo
import mongoose from 'mongoose' //mongoose
import MongoStore from 'connect-mongo';

//Passport
import { passportInit } from './config/config.passport.js';
import passport from 'passport';

const PORT = 8080
const app = express()

// Handlebars
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname+"/public"))

app.use(sessions({
  secret:"CoderCoder",
  resave: true,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://nunezsantiago43:pass1234@coder49975.wmyvz3z.mongodb.net/?retryWrites=true&w=majority',
    mongoOptions: {
      dbName: "ecommerce"
    },
    ttl: 3600
  })
}))

// Set routers

app.use('/api/users', usersRouter)
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/sessions', sessionsRouter)
app.use('/', viewsRouter)

// Passport configuration

passportInit()
app.use(passport.initialize())
app.use(passport.session())

// Server connection
const server = app.listen(PORT, async ()=>{
    console.log('Server is online')
})

// Mongoose connection
try {
  await mongoose.connect('mongodb+srv://nunezsantiago43:pass1234@coder49975.wmyvz3z.mongodb.net/?retryWrites=true&w=majority', {dbName: 'ecommerce'})
  console.log('Successfully connnected to database!!')
} catch (error) {
  console.log(error.message)
}

