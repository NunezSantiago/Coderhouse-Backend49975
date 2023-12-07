import mongoose from "mongoose";

const cartsCollectios = 'carts'

const cartsSchema = new mongoose.Schema(
	{
		id:{
			type: Number,
			required: true,
			unique: true
		},
		products: {
			type: Array,
			default: []
		},
		isDeleted:{
			type: Boolean,
			default: false
		}
	},
	{
		timestamps: true
	})

export const cartsModel = mongoose.model(cartsCollectios, cartsSchema)