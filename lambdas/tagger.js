'use strict';

const AWS = require('aws-sdk');

// Instantialize S3
const S3 = new AWS.S3({
  apiVersion: '2006-03-01',
  signatureVersion: 'v4'
});
// Is 'Instantialize' a real word?

module.exports.handler = async (event) => {
  console.log('Received event: ' + JSON.stringify(event,null,2)); // DEBUG:

  let bucket = event.Records[0].s3.bucket.name;
  let key = event.Records[0].s3.object.key;

  const resp = await S3.getObjectTagging({
    Bucket: bucket,
    Key: key
  }).promise();

  console.log(resp);  // DEBUG:

};
