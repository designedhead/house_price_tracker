import puppeteer from "puppeteer";
import { prisma } from "~/server/db";

const URL =
  "https://www.rightmove.co.uk/properties/133950428#/?channel=RES_BUY";

const check_property = async (req, res) => {
  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    await page.goto(URL);

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
        url: URL,
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

    res.status(200).send(JSON.stringify(updated));
  } catch (e) {
    res.status(500);
  }
};

export default check_property;
