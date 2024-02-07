import mongoose from 'mongoose';

const createSettingSchema = mongoose.Schema({
	settingsName: {
		type: String,
		default: 'emailTemplate',
		allowNull: false
	},
	send_result_email: {
		type: Boolean,
		default: false
	},
	send_result_cc: {
		type: String,
		allowNull: true,
		default: 'rakeshj@transfunnel.com'
	},
	email_logo_path: {
		type: String,
		allowNull: true,
		default: 'https://www.inboundacademy.in/images/inbound-academy-logo.webp'
	}
})

export default mongoose.model('Setting', createSettingSchema);