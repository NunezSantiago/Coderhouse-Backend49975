import mongoose from "mongoose";
import paginate from 'mongoose-paginate-v2'

const productsCollection = 'products'

const productsSchema = new mongoose.Schema(
	{
	id:{
		type: Number,
		required: true,
		unique: true
	},
	title: {
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
		required: true,
		unique: true
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