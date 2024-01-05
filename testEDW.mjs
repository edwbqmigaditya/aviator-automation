import { edwModernization } from "./edwModernization.mjs";
import { getPage } from "./openPages.mjs";

(async () => {

    function delay(time) {
        return new Promise(function (resolve) {
          setTimeout(resolve, time);
        });
      }
  const page = await getPage();

  const spanElement = await page.$x("//span[contains(text(), 'Launch Tool')]");

  if (spanElement.length > 0) {
    await spanElement[0].click();
    console.log("Clicked on the 'Launch Tool' span element.");
  } else {
    console.log("Could not find the 'Launch Tool' span element.");
  }

  // await delay(5000)
  // await page.waitForSelector("a"); // Wait for the first link to be available
  // await page.click("a");

  await page.waitForNavigation({ waitUntil: "networkidle0" });
  await edwModernization(page);
})();
