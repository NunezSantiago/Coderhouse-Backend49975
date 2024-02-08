import mongoose from "mongoose";

const cartsCollectios = 'carts'

const cartsSchema = new mongoose.Schema(
	{
		cartID:{
			type: Number,
			unique: true
		},
		products: {
			type: [{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'products'
				},
				quantity:{
					type: Number
				}
			}],
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