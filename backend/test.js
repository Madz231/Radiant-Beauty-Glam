const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const TEST_EMAIL = process.env.TEST_EMAIL || 'mwnyepah@gmail.com';
const TEST_PASSWORD = process.env.TEST_PASSWORD || '12345';
const TEST_USERNAME = process.env.TEST_USERNAME || 'mwnyepah';

async function runTests() {
  // Register (ignore if already registered)
  try {
    await axios.post('http://localhost:5000/api/auth/register', {
      username: TEST_USERNAME,
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message !== 'User already exists') {
      throw error;
    }
  }

  // Login
  const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
    email: TEST_EMAIL,
    password: TEST_PASSWORD
  });

  const token = loginRes.data.token;
  const userId = loginRes.data.userId;

  // Get Cart
  const cartRes = await axios.get(`http://localhost:5000/api/cart/${userId}`, {
    headers: { Authorization: token }
  });

  console.log(cartRes.data);
}

runTests();
