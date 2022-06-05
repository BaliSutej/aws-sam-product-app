const { ddbClient } = require("./libs/ddbClient");

const { PutItemCommand, DeleteItemCommand, UpdateItemCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb");


const addProduct = async (data) => {

    console.log("Add product with data : " + JSON.stringify(data));


    const params = {
        TableName: "producttable-" + process.env.ENVIRONMENT_NAME + "-svb",
        Item: {
            ProductID: { S: data.productId },
            ProductName: { S: data.productName },
            Price: { N: data.price },
            Category: { S: data.category },
            Inventory: { N: data.inventory }
        },
    };

    try {
        const data = await ddbClient.send(new PutItemCommand(params));
        return buildResponse(200, { "message": "Product successfully added" });
    } catch (err) {
        console.error(err);
        return buildResponse(500, { error: "Some internal error occured" });
    }

}

const updateProductById = async (productId, data) => {

    console.log("Update product with product Id : " + productId + " with new data : " + data.price);


    const params = {
        TableName: "producttable-" + process.env.ENVIRONMENT_NAME + "-svb",
        Key: {
            ProductID: { S: productId }
        },
        UpdateExpression: "set Price = :t",
        ExpressionAttributeValues: {
            ":t": { N: data.price }
        },
        ReturnValues: "ALL_NEW"
    };

    try {
        const data = await ddbClient.send(new UpdateItemCommand(params));
        console.log(data);
        let updatedItem = {
            ProductID: data.Attributes.productId ,
            ProductName: data.Attributes.productName ,
            Price: data.Attributes.price.N,
            Category: data.Attributes.category ,
            Inventory: data.Attributes.inventory
        }
        return buildResponse(200, updatedItem);
    } catch (err) {
        console.error(err);
        return buildResponse(500, { error: "Some Internal Error" });
    }
}

const deleteProductByProductId = async (productId) => {

    console.log("Delete product with product Id : " + productId);
    const params = {
        TableName: "producttable-" + process.env.ENVIRONMENT_NAME + "-svb",
        Key: {
            ProductID: { S: productId }
        },
    };

    try {
        const data = await ddbClient.send(new DeleteItemCommand(params));
        console.log("Success, item deleted", data);
        return buildResponse(200, { message: "Product Successfully deleted" });
    } catch (err) {
        console.log("Error", err);
        return buildResponse(500, "Internal Error");
    }

}

const getProductById = async (productId) => {

    console.log("Get product with Product ID : " + productId);
    const params = {
        TableName: "producttable-" + process.env.ENVIRONMENT_NAME + "-svb",
        Key: {
            ProductID: { S: productId },
        },
    };

    try {
        const data = await ddbClient.send(new GetItemCommand(params));
        console.log("Success", data.Item);
        let item = {
            "ProductID": data.Item.ProductID.S,
            "Inventory": data.Item.Inventory.N,
            "Price": data.Item.Price.N,
            "Category": data.Item.Category.S,
            "ProductName": data.Item.ProductName.S
        }
        return buildResponse(200, item);
    } catch (error) {
        console.error(err);
        return buildResponse(400, { error: "Some internal error occured" });
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


exports.lambdaHandler = async (event) => {

    console.log(JSON.stringify(event));

    switch (true) {
        case event.requestContext.httpMethod === "POST":
            return addProduct(JSON.parse(event.body));
        case event.requestContext.httpMethod === "GET":
            return getProductById(event.queryStringParameters.productId);
        case event.requestContext.httpMethod === "PUT":
            return updateProductById(event.queryStringParameters.productId, JSON.parse(event.body));
        case event.requestContext.httpMethod === "DELETE":
            return deleteProductByProductId(event.queryStringParameters.productId);
        default:
            return buildResponse(400, { error: "Invalid resource access" });
    }
};
