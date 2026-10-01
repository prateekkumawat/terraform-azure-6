const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TABLE_NAME || 'Employees';

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'OPTIONS,PUT'
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

    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Request body is required' })
      };
    }

    const data = JSON.parse(event.body);
    const timestamp = new Date().toISOString();

    const updateExpressionParts = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    const allowedFields = ['name', 'email', 'department', 'role', 'salary', 'dateOfJoining', 'phone', 'profilePicUrl', 'status'];

    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        updateExpressionParts.push(`#${field} = :${field}`);
        expressionAttributeNames[`#${field}`] = field;
        expressionAttributeValues[`:${field}`] = field === 'salary' ? Number(data[field]) : data[field];
      }
    });

    updateExpressionParts.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = timestamp;

    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { empId },
      UpdateExpression: `SET ${updateExpressionParts.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    });

    const response = await docClient.send(command);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Employee updated successfully',
        employee: response.Attributes
      })
    };
  } catch (error) {
    console.error('Error updating employee:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message })
    };
  }
};
