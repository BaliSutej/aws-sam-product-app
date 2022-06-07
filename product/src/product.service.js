const { ddbClient } = require('../libs/ddbClient');
const { PutItemCommand, DeleteItemCommand, UpdateItemCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb");

const addProductToDb = (params) => {
    return ddbClient.send(new PutItemCommand(params));
}

const updateProductToDb = (params) => {
    return ddbClient.send(new UpdateItemCommand(params));
}

const deleteProductFromDb = (params) => {
    return ddbClient.send(new DeleteItemCommand(params));
}

const getProductFromDb = (params) => {
    return ddbClient.send(new GetItemCommand(params));
}

module.exports = {addProductToDb , updateProductToDb ,deleteProductFromDb, getProductFromDb}