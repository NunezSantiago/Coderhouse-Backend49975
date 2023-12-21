import mongoose from "mongoose";

let messagesCollection = 'messages'

let messagesSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
},
{
    timestamps: true
})

export const messagesModel = mongoose.model(messagesCollection, messagesSchema)