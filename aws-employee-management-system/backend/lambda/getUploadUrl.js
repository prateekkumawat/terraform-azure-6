const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const crypto = require('crypto');

const s3Client = new S3Client({});
const BUCKET_NAME = process.env.BUCKET_NAME || 'employee-management-photos-bucket';

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'OPTIONS,POST'
};

exports.handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const fileType = body.fileType || 'image/jpeg';
    const fileExtension = fileType.split('/')[1] || 'jpg';
    
    const key = `profile-pics/${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: fileType
    });

    // Generate pre-signed URL valid for 5 minutes (300 seconds)
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
    const publicUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        uploadUrl,
        key,
        publicUrl
      })
    };
  } catch (error) {
    console.error('Error generating presigned upload URL:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Failed to generate upload URL', error: error.message })
    };
  }
};
