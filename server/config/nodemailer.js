import nodemailer from "nodemailer";

// Create a reusable transporter (reused automatically in serverless cold starts)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, // TLS
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


export default transporter;
