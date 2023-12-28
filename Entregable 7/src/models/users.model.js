import mongoose from "mongoose";

//const usersCollection = 

export const usersModel = mongoose.model('users', new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    role: String
    }, {
    strict: false,
    timestamps: true
}))