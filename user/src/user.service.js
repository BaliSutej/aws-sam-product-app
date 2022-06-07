const { ddbClient } = require('../libs/ddbClient');
const { PutItemCommand, DeleteItemCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb");

const addUserToDb = (params) => {
    return ddbClient.send(new PutItemCommand(params));
}

const deleteUserFromDb = (params) => {
    return ddbClient.send(new DeleteItemCommand(params));
}

const getUserFromDb = (params) => {
    return ddbClient.send(new GetItemCommand(params));
}


module.exports = {addUserToDb,deleteUserFromDb,getUserFromDb};