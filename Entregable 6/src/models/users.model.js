import mongoose from "mongoose";

//const usersCollection = 

export const usersModel = mongoose.model('users', new mongoose.Schema({
    username: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    role: String
}, {
    timestamps: true
}))