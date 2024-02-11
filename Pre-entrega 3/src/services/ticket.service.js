//import { ticketsMemoryDAO as ticketsDAO} from "../dao/ticketsMemoryDAO.js";
//import { ticketsMongoDAO as ticketsDAO } from "../dao/ticketsMongoDAO.js";

import { DAO } from "../dao/factory.js";

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

export const ticketsService = new ticketService(DAO.ticketsDAO)