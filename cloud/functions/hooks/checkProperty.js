const puppeteer = require("puppeteer");
const { prisma } = require("../utils/db");

const checkProperty = async (url) => {
  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    await page.goto(url);

    const price = await page.$("._1gfnqJ3Vtd1z40MlC0MzXu");
    if (!price) {
      throw new Error("Could not find price");
    }
    const handlePrice = await price.$("span");
    const priceString =
      (await handlePrice?.evaluate((price) => price.textContent)) || "";
    const parsedPrice = parseInt(priceString.replace(/[^\d.-]/g, "")) || 0;

    const updated = await prisma.property.update({
      where: {
        url,
      },
      data: {
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
    await browser.close();

    return updated;
  } catch (e) {
    return e;
  }
};

module.exports = checkProperty;
