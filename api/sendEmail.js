const nodemailer = require('nodemailer');

// Create a transporter object using the Ethereal SMTP details
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false, // Use STARTTLS
  auth: {
    user: 'domenico.prosacco84@ethereal.email', // Replace with your Ethereal username
    pass: 'W9vpfxdg48rucx9pDu', // Replace with your Ethereal password
  },
});

// Define your email options
const mailOptions = {
  from: '"Your Name" <domenico.prosacco84@ethereal.email>',
  to: 'chhatbargopi74@gmail.com',
  subject: 'Test Email',
  text: 'This is a test email sent using Ethereal.',
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log('Error occurred:', error);
  }
  console.log('Email sent successfully!');
  console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
});
