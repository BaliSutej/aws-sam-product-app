
var jwt = require('jsonwebtoken');
const { ddbClient } = require("./libs/ddbClient");
const { PutItemCommand, DeleteItemCommand, UpdateItemCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb");

function generateAuthResponse(principalId, effect, methodArn) {
    const policyDocument = generatePolicyDocument(effect, methodArn);

    return {
        principalId,
        policyDocument
    }
}

function generatePolicyDocument(effect, methodArn) {
    if (!effect || !methodArn) return null
    const policyDocument = {
        Version: '2012-10-17',
        Statement: [{
            Action: 'execute-api:Invoke',
            Effect: effect,
            Resource: methodArn
        }]
    };
    return policyDocument;
}

exports.lambdaHandler = async (event, context) => {
    let methodArn = event.methodArn;
    try {

        var decoded = jwt.verify(event.headers.authorizationToken, 'privateKey');
        console.log("Hey");
        const params = {
            TableName: "UserTablesvb",
            Key: {
                userID: { S: decoded.userId }
            },
        };
        const res = await ddbClient.send(new GetItemCommand(params));


        if (res["Item"]) {
            return generateAuthResponse('user', 'Allow', methodArn);
        }
        else
            return generateAuthResponse('user', 'Deny', methodArn);

    } catch (err) {
        console.log(err);
        return generateAuthResponse('user', 'Deny', methodArn);
    }

};



function buildResponse(statusCode, body) {
    return {
        statusCode: statusCode,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }
}
