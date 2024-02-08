import mongoose from "mongoose";

const ticketsCollectios = 'tickets'

const ticketsSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true
    },
    purchase_datetime: Date,
    amount: Number,
    purchaser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts'
    }
}, {
    timestamps: true
})

export const ticketsModel = mongoose.model(ticketsCollectios, ticketsSchema)