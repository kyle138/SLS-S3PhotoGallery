'use strict';

// add/configure modules
import { s3Client } from "../libs/s3Client.js";
import { GetObjectTaggingCommand } from "@aws-sdk/client-s3";

// ************
// Main handler
export const handler = async (event) => {
  console.log('Received event: ' + JSON.stringify(event,null,2)); // DEBUG:

  // *** Check that records, s3, etc etc actually exists...
  let bucket = event.Records[0].s3.bucket.name;
  let key = event.Records[0].s3.object.key;
  // **************************************
  // Batch job seems to trigger 1 lambda per object, but let's Promise.all[] for all records to be safe...
  // **************************************

  // *** if the above exists...
  await s3Client.send(new GetObjectTaggingCommand({
    Bucket: bucket,
    Key: key
  }))
  .then((resp) => {
    console.log('resp: ' + JSON.stringify(resp,null,2));  // DEBUG:

    let labels = resp?.TagSet.find(o => o.Key === 'labels')?.Value;
    console.log(`labels: ${labels}`); // DEBUG
    labels = labels?.split(':');
    console.log('labels: ' + JSON.stringify(labels,null,2));  // DEBUG:
  
    // ***.then() add the object name to json for each label...
  })
  .then(() => {
    return;
  })
  .catch((err) => {
    console.error(err);
  });

};
