
const app = require('../../user/app.js');
var event, context;
jest.mock('../../user/')

describe('Product lambda unit tests', () => {
    const env = process.env;

    beforeEach(() => {
        jest.resetModules()
        process.env = { ...env }
        process.env.ENVIRONMENT_NAME = "test";
    })

    afterEach(() => {
        process.env = env
    })


    test('Add Product Functionality test', async () => {
        event = require("../../events/add-product.json");
        const result = await app.lambdaHandler(event, context);
        expect(typeof result).toBe("object");
        expect(result).toEqual({
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: '{"message":"Product successfully added"}'
        });
    });

    test('Get Product Functionality test', async () => {
        event = require("../../events/get-product.json");
        const result = await app.lambdaHandler(event, context);
        expect(typeof result).toBe("object");
        expect(result.statusCode).toBe(200);
        expect(result.body).toEqual(JSON.stringify({
            "productId": "prod123",
            "inventory": "100",
            "price": "10",
            "category": "food",
            "productName": "Nestle Munch"
        }));
    });

    test('Delete product Functionality test', async () => {
        event = require("../../events/delete-product.json");
        const result = await app.lambdaHandler(event, context);
        expect(result).toEqual({
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: '{"message":"Product Successfully deleted"}'
        });
    });

    test('Update product Functionality test', async () => {
        event = require("../../events/update-product.json");
        const result = await app.lambdaHandler(event, context);
        expect(typeof result).toBe("object");
        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body)).toEqual({
            "productId": "prod1234",
            "inventory": "100",
            "price": "15",
            "category": "food",
            "productName": "Nestle Munch"
        });
    });
});