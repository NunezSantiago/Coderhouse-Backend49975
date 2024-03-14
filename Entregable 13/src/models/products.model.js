import mongoose from "mongoose";
import paginate from 'mongoose-paginate-v2'

const productsCollection = 'products'

const productsSchema = new mongoose.Schema(
	{
	title: {
		type: String,
		required: true
	},
	// Email of the user that created the product
	owner: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	thumbnails: {
		type: Array,
		default: []
	},
	code: {
		type: String,
		unique: true,
		required: true
	},
	stock: {
		type: Number,
		required: true
	},
	status: {
		type: Boolean,
		default: true
	},
	category:{
		type: String,
		required: true
	},
	isDeleted:{
		type: Boolean,
		default: false
	}     
	},
	{
	timestamps: true,
	})

productsSchema.plugin(paginate)

export const productsModel = mongoose.model(productsCollection, productsSchema)