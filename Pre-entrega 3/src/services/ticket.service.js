import { ticketsMongoDAO } from "../dao/ticketsMongoDAO.js";

class ticketService{

    constructor(dao){
        this.dao = new dao()
    }

    async getTicketByCode(code){
        return await this.dao.getByCode(code)
    }

    async createTicket(newTicket){
        return await this.dao.create(newTicket)
    }
}

export const ticketsService = new ticketService(ticketsMongoDAO)