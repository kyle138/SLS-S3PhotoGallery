'use strict';

module.exports.handler = async (event) => {
  console.log('Received event: ' + JSON.stringify(event,null,2)); // DEBUG: 
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
