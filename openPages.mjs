import puppeteer from "puppeteer";
import fs from "fs";

const COOKIES_FILE_PATH = "./cookies.json"; // File path to save cookies

export const getPage = async () => {
  const browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
    args: ["--disable-web-security", "--ignore-certificate-errors"],
    headless: false,
    defaultViewport: {
      width: 1366,
      height: 768,
    },
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
    page6.goto("https://34.28.83.153:8432/docs"),
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

  await page.setDefaultNavigationTimeout(600000);

  const currentLocalStorageData = await page.evaluate(() => {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      data[key] = localStorage.getItem(key);
    }
    return data;
  });

  // Get the cookies after login
  const currentCookies = await page.cookies();
  console.log("Logged-in Cookies:", currentCookies);

  const dataToSave = {
    cookies: currentCookies,
    localStorageData: currentLocalStorageData,
  };

  fs.writeFileSync(COOKIES_FILE_PATH, JSON.stringify(dataToSave, null, 2));
  console.log("Cookies and local storage data saved to file.");
  // If the span element is found, click on it
  return page;
};
