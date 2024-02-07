import nodemailer from 'nodemailer';
import hbs from "nodemailer-express-handlebars";
import path from 'path';
import { fileURLToPath } from 'url';
// userReport, settingsInfo,
export const sendEmailTemplate = async (userReport, settingsInfo, email) => {
	const userInfo = await UserModel.findOne({ email: email });
	console.log(userInfo)
	if (userInfo) {
		const transporter = nodemailer.createTransport(
			{
				host: process.env.EMAIL_HOST,
				port: process.env.EMAIL_PORT,
				service: 'Smtp',
				secure: true,
				auth: {
					user: process.env.EMAIL_AUTH_USER,
					pass: process.env.EMAIL_AUTH_PASSWORD
					// pass: 'zylwjneachaervmi'
				}
			}
		);
		const __dirname = path.dirname(fileURLToPath(import.meta.url));
		const handlebarOptions = {

			viewEngine: {
				extName: ".handlebars",
				partialsDir: path.resolve(__dirname, "./views"),
				defaultLayout: false
			},
			viewPath: path.resolve(__dirname, "./views"),
			extName: ".handlebars"
		};

		transporter.use('compile', hbs(handlebarOptions))
		const mailOptions = {
			from: process.env.EMAIL_FROM, // sender address
			template: 'email', // the name of the template file, i.e., email.handlebars
			to: email,
			subject: `Inbound Academy`,
			cc: settingsInfo.send_result_cc,

			context: {
				name: userInfo.FirstName + " " + userInfo.LastName,
				maxMarks: userReport.total_attempted,
				marksObtained: userReport.marks_Obtained,
				passScore: `${userReport.user_percentage}%`,
				examName: userReport.exam_name,
				result: userReport.result,
				logo: settingsInfo.email_logo_path
			}


		}
		try {
			await transporter.sendMail(mailOptions);
		} catch (error) {
			console.log(`Nodemailer error sending email to`, error);
		}
	}

}




