const functions = require("firebase-functions");
const { prisma } = require("./utils/db");
const checkPropertyPrice = require("./hooks/checkPropertyPrice");
const checkProperty = require("./hooks/checkProperty");

const regionalFunctions = functions
  .region("europe-west2")
  .runWith({ memory: "1GB" });

exports.dailyUpdate = regionalFunctions.pubsub
  .schedule("0 19 * * *")
  .timeZone("Europe/London")
  .onRun(async (request, response) => {
    console.log("Starting daily update");
    const properties = await prisma.property.findMany();
    console.log("All properties available to update", properties);
    for (let index = 0; index < properties.length; index++) {
      const property = properties[index];
      const propertyChecked = await checkPropertyPrice(property.url);
      console.log(property.id, propertyChecked);
    }

    console.log("Finished checking properties");

    response.send("Complete.");
  });
exports.test = regionalFunctions.https.onRequest(async (request, response) => {
  console.log("Starting daily update");
  const properties = await prisma.property.findMany();
  console.log("All properties available to update", properties);
  for (let index = 0; index < properties.length; index++) {
    const property = properties[index];
    const propertyChecked = await checkPropertyPrice(property.url);
    console.log(property.id, propertyChecked);
  }

  console.log("Finished checking properties");

  response.send("Complete.");
});

exports.checkProperty = regionalFunctions.https.onRequest(
  async (request, response) => {
    try {
      const { url } = request.query;
      if (!url) {
        response.send("Include a url in the query.");
      }
      const property = await checkProperty(url);

      if (!property?.title) {
        response.send({ error: "No property found" });
      }
      response.send({
        property,
      });
    } catch (error) {
      response.send({
        error,
      });
    }
  }
);
