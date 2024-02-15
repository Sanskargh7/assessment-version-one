import mongoose from "mongoose";

const responseSchema = mongoose.Schema({
	userId: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
		required: true
	},
	userQuestion: {
		type: Array,
		required: true,
		allowNull: false,
	},
	questionTime: {
		type: Number,
		allowNull: false
	},
	userIndexValue: {
		type: Number,
		allowNull: false
	},
	exam_type: {
		type: mongoose.Types.ObjectId,
		allowNull: false
	},
	exam_name: {
		type: String,
		allowNull: false,
	},
	exam_slug: {
		type: String,
		allowNull: false,
	},
	responseCount: {
		type: Number,
		default: 0
	},
	discard: {
		type: Boolean,
		default: false
	}

}, { timestamps: true })
export default mongoose.model('QuestionsResponse', responseSchema)






