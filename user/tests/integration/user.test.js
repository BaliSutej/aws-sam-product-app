const axios = require('axios');
const app = require('../../app.js');
const data = require('../../../events/user-register.json');
const config = require("../../../config.json");

describe('User Service Test ', () => {

    test('User service integration test', async () => {
        console.log("----- Begin Test -----------");
        console.log(await app.lambdaHandler(data, ""));
        console.log("----- End Test -------------");
    });
});



