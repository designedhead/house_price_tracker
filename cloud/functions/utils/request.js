const axios = require("axios");

async function makeRequest(config) {
  return new Promise((resolve, reject) => {
    axios
      .request(config)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(new Error(`Request failed: ${error.message}`));
      });
  });
}

module.exports = makeRequest;
