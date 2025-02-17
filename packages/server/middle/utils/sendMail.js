require('dotenv').config();
const AWS = require('aws-sdk');

// Configure AWS SES
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

async function sendEmail() {
  const params = {
    Source: process.env.SENDER_EMAIL, // Must be a verified sender
    Destination: {
      ToAddresses: ['sachet.singh@gmail.com'], // Change this to the actual recipient
    },
    Message: {
      Subject: { Data: 'Hello from AWS SES' },
      Body: {
        Text: { Data: 'This is a test email sent via AWS SES using Node.js.' },
      },
    },
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log('Email sent:', result);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

// Call the function
sendEmail();
