const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TABLE_NAME || 'Employees';

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'OPTIONS,GET'
};

exports.handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  try {
    const empId = event.pathParameters ? event.pathParameters.id : null;

    if (empId) {
      // Get single employee
      const command = new GetCommand({
        TableName: TABLE_NAME,
        Key: { empId }
      });

      const response = await docClient.send(command);

      if (!response.Item) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ message: `Employee with ID ${empId} not found` })
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(response.Item)
      };
    } else {
      // List all employees
      const command = new ScanCommand({
        TableName: TABLE_NAME
      });

      const response = await docClient.send(command);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(response.Items || [])
      };
    }
  } catch (error) {
    console.error('Error fetching employee(s):', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message })
    };
  }
};
