'use strict';

import { S3Client, GetObjectTaggingCommand } from "@aws-sdk/client-s3"

const client = new S3Client({ region: "us-east-1" });

module.exports.handler = async (event) => {
  console.log('Received event: ' + JSON.stringify(event,null,2)); // DEBUG:

  let bucket = event.Records[0].s3.bucket.name;
  let key = event.Records[0].s3.object.key;

  const command = new GetObjectTaggingCommand({
  Bucket: bucket,
  Key: key
  });

  const response = await client.send(command);
  console.log(response);  // DEBUG: 

};
