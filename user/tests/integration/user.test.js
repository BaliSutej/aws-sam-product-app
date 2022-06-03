const axios = require('axios');
const config = require("../../../config.json");

test('User register endpoint test', async () => {

    const response = await axios.post("https://ei8pbbl4y0.execute-api.us-east-1.amazonaws.com/test/user/register",{
        "userId": "svb@gmail.com",
        "name": "sutej",
        "password": "svb@gmail.com"
    });
    expect(response.data.message).toBe("user successfully added");
});

test('Invalid user login test using user endpoint', async () => {
    const response = await axios.post("https://ei8pbbl4y0.execute-api.us-east-1.amazonaws.com/test/user/login",{
        "userId": "svb@gmail.com",
        "password": "svb@gmail.com"
    });
    expect(typeof response.data).toBe("object");
    expect(typeof response.data.token).toBe("string");
});

