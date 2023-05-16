const puppeteer = require("puppeteer");
const { prisma } = require("../utils/db");
const makeRequest = require("../utils/request");

const checkPropertyPrice = async (url, pageFunction) => {
  try {
    let page = pageFunction;
    if (page == null) {
      const browser = await puppeteer.launch({ headless: "new" });
      page = await browser.newPage();
    }

    await page.goto(url);

    const price = await page.$("._1gfnqJ3Vtd1z40MlC0MzXu");
    if (!price) {
      throw new Error("Could not find price");
    }
    const handlePrice = await price.$("span");
    const priceString =
      (await handlePrice?.evaluate((price) => price.textContent)) || "";
    const parsedPrice = parseInt(priceString.replace(/[^\d.-]/g, "")) || 0;
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

    const updated = await prisma.property.update({
      where: {
        url,
      },
      data: {
        sold: !!soldHandle,
        lat: coordinates.lat,
        lng: coordinates.lng,
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

    // Close connection
    // await browser.close();

    return updated;
  } catch (e) {
    return e;
  }
};

module.exports = checkPropertyPrice;
