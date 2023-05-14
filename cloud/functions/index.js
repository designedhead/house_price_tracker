const functions = require("firebase-functions");
const { prisma } = require("./utils/db");
const checkPropertyPrice = require("./hooks/checkPropertyPrice");
const checkProperty = require("./hooks/checkProperty");

const regionalFunctions = functions
  .region("europe-west2")
  .runWith({ memory: "1GB", timeoutSeconds: 540 });

exports.dailyUpdate = regionalFunctions.pubsub
  .schedule("0 19 * * *")
  .timeZone("Europe/London")
  .onRun(async (request, response) => {
    console.log("Starting daily update");
    const properties = await prisma.property.findMany({
      where: {
        archived: false,
        sold: false,
      },
    });

    for (let index = 0; index < properties.length; index++) {
      const property = properties[index];
      const propertyChecked = await checkPropertyPrice(property.url);
      console.log("Property Updated", property.id, property.name);
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

exports.updateMedia = regionalFunctions.https.onRequest(
  async (request, response) => {
    console.log("Starting media update");
    const properties = await prisma.property.findMany({
      where: {
        archived: false,
        sold: false,
      },
    });
    const filteredProperties = properties.filter(
      (property) => property.media.length <= 3
    );
    console.log("🚀  filteredProperties", filteredProperties);
    console.log("All properties available to update", filteredProperties);
    for (let index = 0; index < filteredProperties.length; index++) {
      const property = filteredProperties[index];
      const propertyChecked = await checkProperty(property.url);
      await prisma.property.update({
        where: {
          url: property.url,
        },
        data: {
          media: propertyChecked.media,
        },
      });
    }

    console.log("Finished checking properties");

    response.send("Complete.");
  }
);
