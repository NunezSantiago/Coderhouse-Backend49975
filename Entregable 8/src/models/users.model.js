import mongoose from "mongoose";

//const usersCollection = 

export const usersModel = mongoose.model('users', new mongoose.Schema({
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
    } 
    }, {
    strict: false,
    timestamps: true
}))