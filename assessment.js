const puppeteer = require("puppeteer");
const fs = require("fs");

const COOKIES_FILE_PATH = "./cookies.json"; // File path to save cookies

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

(async () => {
  // Launch a headless browser
  const browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
    args: ["--disable-web-security", "--ignore-certificate-errors"],
    headless: false,
    defaultViewport: null,
  });

  // Create a new page with increased width and height
  const page = await browser.newPage();
  await page.goto("https://geu-ip-edw-assessment-day0.ue.r.appspot.com");

  const page1 = await browser.newPage();
  const page2 = await browser.newPage();

  const page3 = await browser.newPage();

  const page4 = await browser.newPage();

  const page5 = await browser.newPage();

    const page6 = await browser.newPage();

  const arr = [
    page1.goto("https://34.121.80.106:8432/docs"),
    page2.goto("https://104.154.159.171:8432/docs"),
    page3.goto("https://34.30.140.26:8432/docs"),
    page4.goto("http://34.68.217.240:8000/docs"),
    page5.goto("https://34.70.185.253:8432/docs"),
    // page6.goto("https://34.28.83.153:8432/docs"),
  ];

  Promise.all(arr).then(() => {
    page1.close();
    page2.close();
    page3.close();
    page4.close();
    page5.close();
    page6.close();
  });

  await page.setViewport({
    width: 1366,
    height: 768,
  });
  await page.bringToFront();

  // Check if the cookies file exists and has data
  if (fs.existsSync(COOKIES_FILE_PATH)) {
    const data = fs.readFileSync(COOKIES_FILE_PATH, "utf8");
    const { cookies, localStorageData } = JSON.parse(data);
    if (Array.isArray(cookies) && cookies.length > 0) {
      // Set the cookies for the page
      await page.setCookie(...cookies);
      console.log("Cookies loaded from the file.");
    }

    if (localStorageData) {
      // Inject custom JavaScript to set the local storage data
      await page.evaluate((localStorageData) => {
        for (const key in localStorageData) {
          localStorage.setItem(key, localStorageData[key]);
        }
      }, localStorageData);

      console.log("Local storage data loaded from the file.");
    }
  }
  // Navigate to the URL

  // Wait for the page to load completely (you can adjust the timeout as needed)
  //   await page.waitForNavigation({ waitUntil: 'networkidle0' });

  // Check if the cookies file exists and has data

  const spanElement = await page.$x("//span[contains(text(), 'Launch Tool')]");

  await page.setDefaultNavigationTimeout(600000);
  // If the span element is found, click on it
  if (spanElement.length > 0) {
    await spanElement[0].click();
    console.log("Clicked on the 'Launch Tool' span element.");
  } else {
    console.log("Could not find the 'Launch Tool' span element.");
  }

  // Wait for the page to complete navigation (including any redirects)
  await page.waitForNavigation({ waitUntil: "networkidle0" });

  // At this point, the page has completed navigation (including any redirects)
  console.log("Page has finished navigating.");

  // Get the cookies after login
  const currentCookies = await page.cookies();
  console.log("Logged-in Cookies:", currentCookies);

  // At this point, the page has completed navigation (including any redirects)
  console.log("Page has finished navigating.");
  const currentLocalStorageData = await page.evaluate(() => {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      data[key] = localStorage.getItem(key);
    }
    return data;
  });

  const dataToSave = {
    cookies: currentCookies,
    localStorageData: currentLocalStorageData,
  };

  fs.writeFileSync(COOKIES_FILE_PATH, JSON.stringify(dataToSave, null, 2));
  console.log("Cookies and local storage data saved to file.");

  await delay(5000);

  const [sqlMigrationButton] = await page.$x(
    '//span[contains(text(), "Start New Migration")]'
  );

  if (sqlMigrationButton) {
    await sqlMigrationButton.click();
    console.log(
      "Clicked on the element with ' Start New Migration ' as inner text."
    );
  } else {
    console.error("Element with ' Start New Migration ' not found.");
  }

  await delay(3000);

  const divElement = await page.$x(
    "//div[contains(text(), 'Migrate data from Taradata to BigQuery')]"
  );

  console.log(divElement);

  if (divElement.length > 0) {
    await divElement[0].click();
    console.log(
      "Clicked on the 'Migrate data from Taradata to BigQuery' div element."
    );
  } else {
    console.log(
      "Could not find the 'Migrate data from Taradata to BigQuery' div element."
    );
  }

  const h2Element = await page.$x("//h2[contains(text(), 'Assessment')]");
  await delay(1000);

  // If the h2 element is found, click on it
  if (h2Element.length > 0) {
    await h2Element[0].click();
    console.log("Clicked on the 'Assessment' h2 element.");
  } else {
    console.log("Could not find the 'Assessment' h2 element.");
  }

  await delay(2000);

  await page.waitForSelector("a"); // Wait for the first link to be available
  await page.click("a");

  await page.waitForNavigation({ waitUntil: "networkidle0" });




  const host = "34.70.185.253";
  
  const inputSelector = '[placeholder="Enter host name"]';
  
  await page.evaluate((selector) => {
    document.querySelector(selector).value = '';
  }, inputSelector);
  await page.type(inputSelector, host);


  await delay(20000)
  
  const [runAssessmentElement] = await page.$x('//span[contains(text(), "Run Assessment")]');
  if (runAssessmentElement) {
    await runAssessmentElement.click();
    console.log("Clicked on the element with 'Run Assessment' as inner text.");
  } else {
    console.error("Element with 'Run Assessment' not found.");
  }

  await delay(3000);
})();
