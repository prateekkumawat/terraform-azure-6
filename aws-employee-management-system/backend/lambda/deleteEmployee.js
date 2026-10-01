const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TABLE_NAME || 'Employees';

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'OPTIONS,DELETE'
};

exports.handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  try {
    const empId = event.pathParameters ? event.pathParameters.id : null;

    if (!empId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Employee ID parameter is required' })
      };
    }

    const command = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { empId }
    });

    await docClient.send(command);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: `Employee ${empId} deleted successfully`,
        empId
      })
    };
  } catch (error) {
    console.error('Error deleting employee:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message })
    };
  }
};
