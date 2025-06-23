const axios = require("axios");
const { getAuthToken } = require("../services/authService");

async function Log(stack, level, packageName, message) {
  try {
    const token = await getAuthToken();

    const res = await axios.post(
      "http://20.244.56.144/evaluation-service/logs",
      {
        stack,
        level,
        package: packageName,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(" Log sent:", res.data);
  } catch (err) {
    console.error(" logging fail:", err.response?.data || err.message);
  }
}

module.exports = { Log };


