import { ticketsModel } from "../models/ticket.model.js";

export class ticketsMongoDAO{
    constructor(){}

    async getByCode(code){
        try {
            return await ticketsModel.findOne({code})
        } catch (error) {
            return {error: error}
        }
    }

    async create(newTicket){

        try {
            return await ticketsModel.create(newTicket)
        } catch (error) {
            return {error: error}
        }
    }

}