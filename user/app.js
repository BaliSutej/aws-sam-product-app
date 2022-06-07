
const { ddbClient } = require("./libs/ddbClient");
const { addUserToDb, getUserFromDb, deleteUserFromDb } = require("./src/user.service");
const { PutItemCommand, DeleteItemCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb");
var jwt = require('jsonwebtoken');



exports.lambdaHandler = async (event, context) => {

    let response;

    try {
        console.log(JSON.stringify(event));

        if (event.path === "/user/register/" || event.path === "/user/register") {
            return addUser(JSON.parse(event.body));
        }

        if (event.path === "/user/login/" || event.path === "/user/login") {
            return getUser(JSON.parse(event.body));
        }

        if (event.path === "/user/delete/" || event.path === "/user/delete") {
            return deleteUser(JSON.parse(event.body));
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

const deleteUser = async (data) => {

    try {
        const getUserParams = {
            TableName: "usertable-" + process.env.ENVIRONMENT_NAME + "-svb",
            Key: {
                userID: { S: data.userId }
            },
        };

        const res = await getUserFromDb(getUserParams);
        if (res["Item"]) {
            if (res["Item"]["password"]["S"] === data.password) {
                console.log("Delete user with userId : " + data.userId);
                const params = {
                    TableName: "usertable-" + process.env.ENVIRONMENT_NAME + "-svb",
                    Key: {
                        userID: { S: data.userId }
                    },
                };

                const userdata = await deleteUserFromDb(params);
                return buildResponse(200, { message: "User Successfully deleted" });

            } else {
                return buildResponse(400, { "error": "Invalid Username or Password" });
            }
        } else {
            return buildResponse(400, { "error": "Invalid Username or Password" });
        }

    } catch (error) {
        console.error(error);
        return buildResponse(500, { error: "Some internal error occured" });
    }

}


const getUser = async (data) => {

    console.log("Get user with userID : " + data.userId);

    const params = {

        TableName: "usertable-" + process.env.ENVIRONMENT_NAME + "-svb",
        Key: {
            userID: { S: data.userId }
        },
    };

    try {
        const res = await getUserFromDb(params);
        console.log(res);

        if (res["Item"]) {
            if (res["Item"]["password"]["S"] === data.password) {
                var token = jwt.sign({ userId: data.userId }, "privateKey");
                return buildResponse(200, { "token": token });
            } else {
                return buildResponse(400, { "error": "Invalid Username or Password" });
            }
        } else {
            return buildResponse(400, { "error": "Invalid Username or Password" });
        }

    } catch (error) {
        console.log(error);
        return buildResponse(500, { error: "Some internal error occured" });
    }

}


const addUser = async (data) => {

    console.log("Add User with data : " + JSON.stringify(data));

    const getUserParams = {
        TableName: "usertable-" + process.env.ENVIRONMENT_NAME + "-svb",
        Key: {
            userID: { S: data.userId }
        }
    }
    
    const params = {
        TableName: "usertable-" + process.env.ENVIRONMENT_NAME + "-svb",
        Item: {
            userID: { S: data.userId },
            name: { S: data.name },
            password: { S: data.password },
        },
    };

    try {
        let data = await getUserFromDb(getUserParams);
        if (data.Item === undefined) {
            data = await addUserToDb(params);
            return buildResponse(200, { "message": "user successfully added" });
        }
        return buildResponse(400, { error: "User already present in DB" });
    } catch (err) {
        console.log(err);
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
