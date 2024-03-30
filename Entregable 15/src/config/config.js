import dotenv from 'dotenv'
import swaggerJSDoc from 'swagger-jsdoc';
import __dirname from '../utils.js'; //Utils

dotenv.config({
    override: true,
    path:'./src/.env'
})

const options = 
  {
    definition:{
      openapi: "3.0.0",
      info: {
        title: "API Ecommerce",
        version: "1.0.0",
        description: "Ecommerce documentation"
      }
    },
    apis: [__dirname+"/docs/*.yaml"]
  }

export const swagger_specs = swaggerJSDoc(options)

export const config={
    PORT: process.env.PORT || 8080,
    MONGO_URL: process.env.MONGO_URL,
    DBNAME: process.env.DBNAME,
    SECRETKEY: process.env.SECRETKEY,
    PERSISTENCE: "mongo",
    MODE: process.env.MODE || "Development"
}