const puppeteer = require("puppeteer");
const { prisma } = require("../utils/db");
const makeRequest = require("../utils/request");

const checkPropertyPrice = async (propertyUrl, property) => {
  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto(propertyUrl);
    const price = await page.$("._1gfnqJ3Vtd1z40MlC0MzXu");
    if (!price) {
      throw new Error("Could not find price");
    }
    const handlePrice = await price.$("span");
    const priceString =
      (await handlePrice?.evaluate((price) => price.textContent)) || "";
    const parsedPrice = parseInt(priceString.replace(/[^\d.-]/g, "")) || 0;
    const discounted = parsedPrice < property.price;

    const soldHandle = await page.$(
      ".ksc_lozenge.berry._2WqVSGdiq2H4orAZsyHHgz"
    );

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${property.name},ayesbury&key=${process.env.GOOGLE_API_KEY}`;
    const config = {
      method: "GET",
      url,
    };
    const { results } = await makeRequest(config);

    const coordinates = results[0]?.geometry?.location;

    console.log(
      "🚀  discounted",
      { priceString, parsedPrice, coordinates, soldHandle, discounted },
      {
        sold: !!soldHandle,
        lat: coordinates.lat || null,
        lng: coordinates.lng || null,
        discounted: discounted,
        PropertyUpdates: {
          create: {
            price: parsedPrice,
          },
        },
      }
    );

    const updated = await prisma.property.update({
      where: {
        url: propertyUrl,
      },
      data: {
        sold: !!soldHandle,
        ...(!!coordinates.lat && { lat: coordinates.lat }),
        ...(!!coordinates.lng && { lng: coordinates.lng }),
        discounted: discounted,
        PropertyUpdates: {
          create: {
            price: parsedPrice,
          },
        },
      },
      include: {
        PropertyUpdates: true,
      },
    });
    console.log("🚀  updated", updated);

    // Close connection
    await browser.close();

    return updated;
  } catch (e) {
    console.log(e);
    return e;
  }
};

module.exports = checkPropertyPrice;
