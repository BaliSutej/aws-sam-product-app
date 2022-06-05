const axios = require('axios');
const config = require("../../../config.json");

describe('User Service Test ', () => {
    
    test('User register endpoint test', async () => {
        const response = await axios.post("https://ei8pbbl4y0.execute-api.us-east-1.amazonaws.com/test/user/register", {
            "userId": "svb@gmail.com",
            "name": "sutej",
            "password": "svb@gmail.com"
        });
        expect(response.data.message).toBe("user successfully added");
    });

    test('Valid user login test using user endpoint', async () => {
        const response = await axios.post("https://ei8pbbl4y0.execute-api.us-east-1.amazonaws.com/test/user/login", {
            "userId": "svb@gmail.com",
            "password": "svb@gmail.com"
        });

        expect(response.status).toBe(200);
        expect(typeof response.data).toBe("object");
        expect(typeof response.data.token).toBe("string");
    });

    test('Invalid user login test using user endpoint', async () => {
        try {
            const response = await axios.post("https://ei8pbbl4y0.execute-api.us-east-1.amazonaws.com/test/user/login", {
                "userId": "sv@gmail.com",
                "password": "svb@gmail.com"
            });
        } catch (error) {
            const response = error.response;
            expect(response.status).toBe(400);
            expect(typeof response.data).toBe("object");
            expect(response.data.error).toBe("Invalid Username or Password");

        }
    });

    afterAll(() => {
        console.log("Cleanup database");
    });
});



