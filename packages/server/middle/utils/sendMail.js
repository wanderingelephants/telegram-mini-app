require('dotenv').config();
const AWS = require('aws-sdk');

// Configure AWS SES
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

const sendEmail = async(ToAddresses, SubjectLine, BodyText) => {
  const params = {
    Source: process.env.SENDER_EMAIL, // Must be a verified sender
    Destination: {
      ToAddresses//: ['sachet.singh@gmail.com'], // Change this to the actual recipient
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
    const result = await ses.sendEmail(params).promise();
    console.log('Email sent:', result);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
module.exports = sendEmail

// Call the function
//sendEmail();
