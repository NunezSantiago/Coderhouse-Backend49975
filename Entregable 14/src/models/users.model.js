import mongoose from "mongoose";

const usersCollection = 'users'

const usersSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    role: {
        type: String,
        default: 'User'
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts'
    },
    last_connection: {
        type: Date
    },
    documents: [{
        name: String,
        reference: String
    }],
    isDeleted: {
        type: Boolean,
        default: false
    }
    }, {
    strict: false,
    timestamps: true
})

export const usersModel = mongoose.model(usersCollection, usersSchema)