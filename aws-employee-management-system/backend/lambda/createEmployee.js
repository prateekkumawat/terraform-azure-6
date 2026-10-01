const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const crypto = require('crypto');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TABLE_NAME || 'Employees';

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'OPTIONS,POST'
};

exports.handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Request body is required' })
      };
    }

    const data = JSON.parse(event.body);
    const { name, email, department, role, salary, dateOfJoining, profilePicUrl, phone } = data;

    if (!name || !email || !department) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Missing required fields: name, email, department' })
      };
    }

    const empId = `EMP-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const timestamp = new Date().toISOString();

    const newEmployee = {
      empId,
      name,
      email,
      department,
      role: role || 'Employee',
      salary: salary ? Number(salary) : 0,
      dateOfJoining: dateOfJoining || timestamp.split('T')[0],
      phone: phone || '',
      profilePicUrl: profilePicUrl || '',
      status: 'Active',
      createdAt: timestamp,
      updatedAt: timestamp
    };

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: newEmployee
    });

    await docClient.send(command);

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        message: 'Employee created successfully',
        employee: newEmployee
      })
    };
  } catch (error) {
    console.error('Error creating employee:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message })
    };
  }
};
