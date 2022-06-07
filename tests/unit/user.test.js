
const app = require('../../product/app.js');
var event, context;
jest.mock('../../product/src/product.service.js')

describe('Product lambda unit tests', () => {
    const env = process.env;

    beforeEach(() => {
        jest.resetModules()
        process.env = { ...env }
        process.env.ENVIRONMENT_NAME = "test";
    })

    test('Test 1',() =>{
        console.log("Yet to write unit tests for user");
    });

    afterEach(() => {
        process.env = env
    })

});