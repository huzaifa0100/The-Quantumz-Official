const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/mail', (req, res) => {
  const { name, email, subject, number, message } = req.body;

  // Remove whitespace and sanitize input
  name = name.trim().replace('/\r|\n/g, ');
  email = email.trim();
  subject = subject.trim();
  number = number.trim();
  message = message.trim();

  // Check if all fields are present and valid
  if (!name ||!message ||!number ||!subject ||!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
    res.status(400).send('Please complete the form and try again.');
    return;
  }

  // Set the recipient email address
  const recipient = 'huzi.captain@gmail.com'; // Update this to your desired email address.

  // Set the email subject
  const emailSubject = `New contact from ${subject}`;

  // Build the email content
  const emailContent = `Name: ${name}\n`;
  emailContent += `Subject: ${subject}\n`;
  emailContent += `Email: ${email}\n`;
  emailContent += `Phone: ${number}\n\n`;
  emailContent += `Message:\n${message}\n`;

  // Build the email headers
  const emailHeaders = `From: ${name} <${email}>\r\n`;
  emailHeaders += `Reply-To: ${email}\r\n`;
  emailHeaders += `Content-Type: text/plain; charset=UTF-8\r\n`;

  // Send the email using a mail service (e.g. Nodemailer)
  const transporter = nodemailer.createTransport({
    host: 'mtp.gmail.com',
    port: 587,
    secure: false, // or 'STARTTLS'
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password'
    }
  });

  const mailOptions = {
    from: email,
    to: recipient,
    subject: emailSubject,
    text: emailContent
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).send('Oops! Something went wrong and we couldn\'t send your message.');
      console.error(error);
    } else {
      res.status(200).send('Thank You! Your message has been sent.');
      console.log('Email sent: ' info.response);
    }
  });
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});