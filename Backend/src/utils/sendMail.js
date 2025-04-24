import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config({
  path: "../../.env",
});

export const sendMail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.ethereal.email",
      port: 465,

      auth: {
        user: process.env.GMAIL_USER, // Your Gmail
        pass: process.env.GMAIL_PASS, // App password
      },
    });

    // console.log();
    

    const info = await transporter.sendMail({
      from: `"${process.env.GMAIL_USER}`,
      to,
      subject,
      html,
    });
    // /console.log(info);

    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Unable to send email at the moment.");
  }
};
