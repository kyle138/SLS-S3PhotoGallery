'use strict';

// add/configure modules
import { s3Client } from "../libs/s3Client.js";
import { GetObjectTaggingCommand } from "@aws-sdk/client-s3";

// validateRequiredVar
// Checks if the supplied variable is of type string and has length
// @param {var} reqvar - the variable to check
// @return {promise} - Error or response object
function validateRequiredVar(reqvar) {
  return new Promise((resolve,reject) => {
    // Is the envar a string and have some length?
    console.log(`validateRequiredVar:reqvar:: ${reqvar}`);  // DEBUG
    if(typeof reqvar === 'string' && reqvar.length > 0) {
      return resolve();
    } else {
      return reject(new Error('Missing Required Variable'));
    }
  }); // End Promise
} // End validateRequiredvar

// validateRecord
// Checks if the supplied record contains a bucket name and object key
// @record {object} - the object to check
// @return {promise} - array of validated records
function validateRecord(record) {
  console.log(`validateRecord:record::`,JSON.stringify(record,null,2)); // DEBUG
  return Promise.all([
    validateRequiredVar(record.s3.bucket.name),
    validateRequiredVar(record.s3.object.key)
  ])
  .then(() => {
    return {
      Bucket: record.s3.bucket.name,
      Key: record.s3.object.key
    }; // ***************** THIS DOESN'T FEEL RIGHT
  });

}// End validateRecord

// processRecord
// Processes record to retrieve S3 object tagging
// @record {object} - the S3 object to process
// @return {promise} - Object containing bucket, key, [tags]
function processRecord(record) {
  return new Promise(async (resolve,reject) => {
    await s3Client.send(new GetObjectTaggingCommand(record))
    .then((resp) => {
      console.log('resp: ',JSON.stringify(resp,null,2)); // DEBUG
      let labels = resp?.TagSet.find(o => o.Key === 'labels')?.Value;
      console.log(`labels: ${labels}`); // DEBUG
      labels = labels?.split(':');
      console.log('labels: ' + JSON.stringify(labels,null,2));  // DEBUG:
      record.labels = labels;
      return resolve(record);
    })
    .catch((err) => {
      console.error('processRecord:err:: ',err);
      return reject(err);
    });  
    
  }); // End promise
}

// ************
// Main handler
export const handler = async (event) => {
  console.log('Received event: ' + JSON.stringify(event,null,2)); // DEBUG:

  // Batch job seems to trigger 1 lambda per object, but let's Promise.all[] for all records to be safe...
  await Promise.all(
    event.Records.map(async (record) => await validateRecord(record))
  )
  .then(async (records) => {
    console.log('records: ',JSON.stringify(records,null,2)); // DEBUG
    await Promise.all(records.map(async (record) => await processRecord(record)))
    .then((recordLabel) => {
      console.log('recordLabel: ',JSON.stringify(recordLabel,null,2));  // DEBUG
      // ****************
      // Update a labels.json
    });
  })
  .catch((err) => {
    console.log('err:',err);
  });

};
