'use strict';

// load the AWS SDK
const AWS = require('aws-sdk');

// To/from addresses for email
const fromAddress = process.env.FROM_ADDRESS; // you should change this
const toAddress = process.env.TO_ADDRESS; // you should change this

// I was getting an error saying that the region wasn't set, so this fixes it
if (!AWS.config.region) {
  AWS.config.update({
    region: 'eu-west-1'
  });
}

// HTTP response headers
var http_response_headers = {
  'Access-Control-Allow-Origin':'*',
  'X-Frame-Options':'DENY',
  'Strict-Transport-Security':'max-age=31536000',
  'X-XSS-Protection':'1; mode=block'
};

module.exports.capture = (event, context, callback) => {

  // load ses, for sending emails
  var ses = new AWS.SES();

  console.log(`Received event: `, JSON.stringify(event, null, 2));

  // We really could get all sorts in here. Hope SES does a good job of validating. \o/
  var messageBody = event.body;

  // Send the email via SES.
  ses.sendEmail({
    Destination: {
      ToAddresses: [
        toAddress
      ]
    },
    Message: {
      Body: {
        Text: {
          Data: messageBody,
          Charset: 'UTF-8'
        }
      },
      Subject: {
        Data: 'Capture received an event',
        Charset: 'UTF-8'
      }
    },
    Source: fromAddress,
    ReplyToAddresses: [
      fromAddress
    ]
  }, (err, data) => {

    if (err) {
      // email was not sent
      console.log('Error Sending Email:', JSON.stringify(err, null, 2));
    } else {
      console.log('Email sent');
    }

    if (event.queryStringParameters && event.queryStringParameters.target && event.queryStringParameters.target !="") {
      var response = {
        "statusCode": 302,
        "headers": { 'Location': event.queryStringParameters.target }
      }

      callback(null,response);
    } else {

      // Whatever happens we return ok
      var response = {
        "statusCode": 200,
        "headers": http_response_headers,
        "body": "ok"
      }
        
      callback(null,response);
    }
  });
};
