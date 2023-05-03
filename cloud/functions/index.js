const functions = require("firebase-functions");
const { prisma } = require("./utils/db");
const checkProperty = require("./hooks/checkProperty");

const regionalFunctions = functions.region("europe-west2");

//
exports.hello = regionalFunctions.https.onRequest(async (request, response) => {
  const properties = await prisma.property.findMany();
  let updatedProperties = [];

  for (let index = 0; index < properties.length; index++) {
    const property = properties[index];
    const propertyChecked = await checkProperty(property.url);
    updatedProperties.push(propertyChecked);
  }

  console.log("Finished checking properties");

  response.send({
    properties: updatedProperties,
  });
});

exports.dailyUpdate = regionalFunctions.pubsub
  .schedule("@daily")
  .timeZone("Europe/London") // Users can choose timezone - default is America/Los_Angeles
  .onRun(async (request, response) => {
    const properties = await prisma.property.findMany();
    let updatedProperties = [];

    for (let index = 0; index < properties.length; index++) {
      const property = properties[index];
      const propertyChecked = await checkProperty(property.url);
      updatedProperties.push(propertyChecked);
    }

    console.log("Finished checking properties");

    return null;
  });
