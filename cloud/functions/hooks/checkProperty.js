const puppeteer = require("puppeteer");

const checkProperty = async (url) => {
  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    await page.goto(url);

    const divHandle = await page.$("._2uGNfP4v5SSYyfx3rZngKM");
    const imgHandle = !!divHandle && (await divHandle.$("img"));
    const imageUrl =
      !!imgHandle && (await imgHandle.evaluate((img) => img.src));

    const imageUrls = await page.$$eval(
      "div.yyidGoi1pN3HEaahsw3bi img",
      (imgs) => imgs.map((img) => img.src)
    );

    const title = await page.$("._2uQQ3SV0eMHL1P6t5ZDo2q");
    const titleHandle =
      !!title && (await title.evaluate((title) => title.textContent));

    const price = await page.$("._1gfnqJ3Vtd1z40MlC0MzXu");
    const handlePrice = !!price && (await price.$("span"));
    const priceString =
      !!handlePrice &&
      (await handlePrice.evaluate((price) => price.textContent));

    const parsedPrice = parseInt(priceString.replace(/[^\d.-]/g, "")) || 0;

    const soldHandle = await page.$(
      ".ksc_lozenge.berry._2WqVSGdiq2H4orAZsyHHgz"
    );

    // Close connection
    await browser.close();

    return {
      title: titleHandle,
      image: imageUrl,
      price: parsedPrice,
      sold: !!soldHandle,
      media: imageUrls,
    };
  } catch (e) {
    console.log(e);
    throw new Error(e);
  }
};

module.exports = checkProperty;
