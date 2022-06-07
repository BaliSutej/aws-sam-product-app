const { ddbClient } = require("./libs/ddbClient");

const { addProductToDb, updateProductToDb, deleteProductFromDb, getProductFromDb } = require("./src/product.service");

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

    const paramsForGet = {
        TableName: "producttable-" + process.env.ENVIRONMENT_NAME + "-svb",
        Key: {
            ProductID: { S: data.productId },
        },
    };

    try {
        let data = await getProductFromDb(paramsForGet);
        if (data.Item === undefined) {
            return buildResponse(400, { error: "Product with specified ID not present" });
        } else {
            data = await addProductToDb(params);
            return buildResponse(200, { "message": "Product successfully added" });
        }
    } catch (err) {
        console.error(err);
        return buildResponse(500, { error: "Some internal error occured" });
    }

}

const updateProductById = async (productId, data) => {

    console.log("Update product with product Id : " + productId + " with new data : " + data.price);

    const paramsForGet = {
        TableName: "producttable-" + process.env.ENVIRONMENT_NAME + "-svb",
        Key: {
            ProductID: { S: productId },
        },
    };

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
        let data = await getProductFromDb(paramsForGet);
        if (data.Item === undefined) {
            return buildResponse(400, { error: "Product with specified ID not present" });
        } else {
            data = await updateProductToDb(params);

            let updatedItem = {
                "productId": data.Attributes.ProductID.S,
                "productName": data.Attributes.ProductName.S,
                "price": data.Attributes.Price.N,
                "category": data.Attributes.Category.S,
                "inventory": data.Attributes.Inventory.N
            }
            return buildResponse(200, updatedItem); ß
        }
    } catch (err) {
        console.log(err);
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
        const data = await deleteProductFromDb(params);
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
        const data = await getProductFromDb(params);
        if (data.Item === undefined) {
            return buildResponse(400, { error: "Product with specified ID not present" });
        }
        let item = {
            "productId": data.Item.ProductID.S,
            "inventory": data.Item.Inventory.N,
            "price": data.Item.Price.N,
            "category": data.Item.Category.S,
            "productName": data.Item.ProductName.S
        }
        return buildResponse(200, item);
    } catch (error) {
        console.log(error);
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
