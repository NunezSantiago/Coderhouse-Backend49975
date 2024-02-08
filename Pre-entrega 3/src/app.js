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

import { config } from './config/config.js';


// Mongo
import mongoose from 'mongoose' //mongoose
import MongoStore from 'connect-mongo';

//Passport
import { passportInit } from './config/config.passport.js';
import passport from 'passport';

const PORT = config.PORT
const app = express()

// Handlebars
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname+"/public"))

app.use(sessions({
  secret: config.SECRETKEY,
  resave: true,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: config.MONGO_URL,
    mongoOptions: {
      dbName: config.DBNAME
    },
    ttl: 3600
  })
}))

// Set routers

app.use('/api/users', usersRouter)
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/sessions', sessionsRouter)
app.use('/', viewsRouter)

// Passport configuration

passportInit()
app.use(passport.initialize())
app.use(passport.session())

// Server connection
const server = app.listen(PORT, async ()=>{
    console.log('Server is online', config.PORT)
})

// Mongoose connection
try {
  await mongoose.connect(config.MONGO_URL, {dbName: config.DBNAME})
  console.log('Successfully connnected to database!!')
} catch (error) {
  console.log(error.message)
}

