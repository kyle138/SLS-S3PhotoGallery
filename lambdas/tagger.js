'use strict';


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
