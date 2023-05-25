const functions = require("firebase-functions");
const { prisma } = require("./utils/db");
const puppeteer = require("puppeteer");
const checkPropertyPrice = require("./hooks/checkPropertyPrice");
const checkProperty = require("./hooks/checkProperty");
const makeRequest = require("./utils/request");

const regionalFunctions = functions
  .region("europe-west2")
  .runWith({ memory: "2GB", timeoutSeconds: 540 });

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
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    for (let index = 0; index < properties.length; index++) {
      const property = properties[index];
      await checkPropertyPrice(property.url, page, property.price);
      console.log("Property Updated", property.id, property.name);
    }

    console.log("Finished checking properties");

    response.status(200).send("Complete.");
  });
exports.test = regionalFunctions.https.onRequest(async (request, response) => {
  console.log("Starting daily update");
  const properties = await prisma.property.findMany({
    where: {
      archived: false,
      sold: false,
    },
  });
  console.log("🚀  Updating properties", properties.length);

  for (let index = 0; index < properties.length; index++) {
    const property = properties[index];
    await checkPropertyPrice(property.url, property);
    console.log("Property Updated", property.id, property.name, property.price);
  }

  console.log("Finished checking properties");

  response.status(200).send("Complete.");
});

exports.checkProperty = regionalFunctions.https.onRequest(
  async (request, response) => {
    try {
      const { url } = request.query;
      if (!url) {
        response.status(401).send("Include a url in the query.");
      }
      const property = await checkProperty(url);

      if (!property?.title) {
        response.status(404).send({ error: "No property found" });
      }
      response.status(200).send({
        property,
      });
    } catch (error) {
      response.status(500).send({
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

    response.status(200).send("Complete.");
  }
);

exports.updateLocations = regionalFunctions.https.onRequest(
  async (request, response) => {
    console.log("Starting location update");

    try {
      const properties = await prisma.property.findMany({
        where: {
          archived: false,
        },
      });
      const updatedProperties = [];
      for (let index = 0; index < properties.length; index++) {
        const property = properties[index];
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${property.name},ayesbury&key=${process.env.GOOGLE_API_KEY}`;
        const config = {
          method: "GET",
          url,
        };
        const { results } = await makeRequest(config);

        if (!results?.length) {
          return;
        }

        const coordinates = results[0]?.geometry?.location;
        if (!coordinates) {
          return;
        }

        const updated = await prisma.property.update({
          where: {
            id: property.id,
          },
          data: {
            lat: coordinates.lat,
            lng: coordinates.lng,
          },
        });
        updatedProperties.push(updated);
      }
      response.status(200).send(updatedProperties);
    } catch (error) {
      console.log("Error".error);
      response.status(500).send(error);
    }
  }
);
