require('dotenv').config();
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const sendEmail = async(ToAddresses, SubjectLine, BodyText) => {
  const params = {
    Source: process.env.SENDER_EMAIL, // Must be a verified sender
    Destination: {
      ToAddresses
    },
    Message: {
      Subject: { Data: `${SubjectLine}` },
      Body: {
        Html: { 
          Data: BodyText,
          Charset: 'UTF-8'
        },
        Text: { 
          // Provide a plain text alternative for email clients that don't support HTML
          Data: "Please view this email in an HTML-compatible email client to see the formatted content.",
          Charset: 'UTF-8'
        }
      },
    },
  };
  console.log(params)
  try {
    const command = new SendEmailCommand(params);
    const result = await sesClient.send(command);
    console.log('Email sent:', result);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
module.exports = sendEmail

// Call the function
//sendEmail();
