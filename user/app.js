
const { ddbClient } = require("./libs/ddbClient");

const { PutItemCommand, DeleteItemCommand, UpdateItemCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb");
var jwt = require('jsonwebtoken');



exports.lambdaHandler = async (event, context) => {

    try {
        console.log(JSON.stringify(event));
        
        if (event.path === "/user/register/" || event.path === "/user/register") {
            return addUser(JSON.parse(event.body));
        }

        if (event.path === "/user/login/" || event.path === "/user/login") {
            return getUser(JSON.parse(event.body));
        }

        console.log(JSON.stringify(event));

        response = {
            'statusCode': 400,
            'body': JSON.stringify({
                message: "Invalid Resource",
            })
        }
        return response;
    } catch (err) {
        console.log(err);
        return err;
    }

};


const getUser = async (data) => {

    console.log("Get user with userID : " + data.userId);

    const params = {
        TableName: "UserTablesvb",
        Key: {
            userID: { S: data.userId }
        },
    };

    try {
        const res = await ddbClient.send(new GetItemCommand(params));
        console.log(res);
        
        if (res["Item"]) {
            if(res["Item"]["password"]["S"] === data.password){
                console.log("In In");
                var token = jwt.sign({ userId: data.userId }, "privateKey");
                console.log(token);
                return buildResponse(200, { "token": token });
            }else{
                return buildResponse(400,{"error":"Invalid Username or Password"});
            }
        }else{
            return buildResponse(400,{"error":"Invalid Username or Password"});
        }

    } catch (error) {
        console.error(err);
        return buildResponse(500, { error: "Some internal error occured" });
    }

}


const addUser = async (data) => {

    console.log("Add User with data : " + JSON.stringify(data));

    const params = {
        TableName: "UserTablesvb",
        Item: {
            userID: { S: data.userId },
            name: { S: data.name },
            password: { S: data.password },
        },
    };

    try {
        const data = await ddbClient.send(new PutItemCommand(params));
        console.log(data);
        return buildResponse(200, { "message": "user successfully added" });
    } catch (err) {
        console.error(err);
        return buildResponse(500, { error: "Some internal error occured" });
    }

}

function buildResponse(statusCode, body) {
    return {
        statusCode: statusCode,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }
}
