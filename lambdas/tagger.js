'use strict';

const AWS = require('aws-sdk');

// Instantialize S3
const S3 = new AWS.S3({
  apiVersion: '2006-03-01',
  signatureVersion: 'v4'
});
// Is 'Instantialize' a real word?

module.exports.handler = async (event) => {
  // console.log('Received event: ' + JSON.stringify(event,null,2)); // DEBUG:

  // *** Check that records, s3, etc etc actually exists...
  let bucket = event.Records[0].s3.bucket.name;
  let key = event.Records[0].s3.object.key;

  // *** if the above exists...
  const resp = await S3.getObjectTagging({
    Bucket: bucket,
    Key: key
  }).promise();

  // *** .then()...
  console.log('resp: ' + JSON.stringify(resp,null,2));  // DEBUG:

  let labels = resp?.TagSet.find(o => o.Key === 'labels')?.Value;
  labels = labels?.Value.split(':');
  console.log('labels: ' + JSON.stringify(labels,null,2));  // DEBUG:

  // ***.then() add the object name to json for each label...
};
