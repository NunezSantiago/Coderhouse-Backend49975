import mongoose from "mongoose";
import { config } from "../config/config.js";

const PERSISTENCE = config.PERSISTENCE ? config.PERSISTENCE.toUpperCase() : "MONGO" 
export let DAO

switch (PERSISTENCE) {

    case "MONGO":

        console.log('Using Mongo DAO')

        try {
            await mongoose.connect(config.MONGO_URL, {dbName: config.DBNAME})
            console.log('Successfully connnected to database!!')
        } catch (error) {
            console.log(error.message)
        }

        let { usersMongoDAO } = await import('./usersMongoDAO.js')
        let { cartsMongoDAO } = await import('./cartsMongoDAO.js')
        let { productsMongoDAO } = await import('./productsMongoDAO.js')
        let { ticketsMongoDAO } = await import('./ticketsMongoDAO.js')

        DAO = {
            usersDAO: usersMongoDAO,
            cartsDAO: cartsMongoDAO,
            productsDAO: productsMongoDAO,
            ticketsDAO: ticketsMongoDAO
        }

        break;

    case "MEMORY":
        console.log('Using Memory DAO')

        let { usersMemoryDAO } = await import('./usersMemoryDAO.js')
        let { cartsMemoryDAO } = await import('./cartsMemoryDAO.js')
        let { productsMemoryDAO } = await import('./productsMemoryDAO.js')
        let { ticketsMemoryDAO } = await import('./ticketsMemoryDAO.js')

        DAO = {
            usersDAO: usersMemoryDAO,
            cartsDAO: cartsMemoryDAO,
            productsDAO: productsMemoryDAO,
            ticketsDAO: ticketsMemoryDAO
        }

        break;

    default:
        console.log("Error en persistencia")
        process.exit()
        break;
}