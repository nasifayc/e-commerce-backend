import nodemailer from "nodemailer";

async function sendEmail(recipeintEmail, subject, text) {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: '"Yegna e-commerce" <nasifayc11@gmail.com>',
      to: recipeintEmail,
      subject: subject,
      html: text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email Sent: ${info.messageId}`);
  } catch (e) {
    console.log("Error sending email:", e);
  }
}

export default sendEmail;
