// AWS Infrastructure Configuration
// Replace these placeholders with your actual deployed AWS resource IDs after running manual deployment or scripts.

const AWS_CONFIG = {
  // API Gateway base endpoint (e.g., https://xyz123.execute-api.us-east-1.amazonaws.com/prod)
  apiBaseUrl: '', 

  // Amazon Cognito Configuration
  cognito: {
    userPoolId: '', // e.g., 'us-east-1_Xyz12345'
    clientId: '',   // e.g., '71a2b3c4d5e6f7g8h9'
    region: 'us-east-1'
  },

  // Amazon S3 Bucket Configuration
  s3: {
    bucketName: 'employee-management-photos-bucket',
    region: 'us-east-1'
  },

  // Mode: 'demo' (mock in-browser storage) or 'aws' (live AWS backend API)
  mode: 'demo'
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AWS_CONFIG;
}
