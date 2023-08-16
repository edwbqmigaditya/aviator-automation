import puppeteer from "puppeteer";
import fs from "fs";
import { schemaMigrationProcess } from "./schema_migration.mjs";

const COOKIES_FILE_PATH = "./cookies.json"; // File path to save cookies

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}
async function clickDownArrowButton(page) {
  await page.evaluate(() => {
    const downArrowElement = document.getElementsByClassName(
      "expand-icon ng-star-inserted"
    )[0];

    if (downArrowElement) {
      downArrowElement.click();
      console.log(" down arrow element  found and clicked");
    } else {
      console.log(" down arrow element not found");
    }
  });
}

(async () => {
  async function checkDisabled(buttonElement) {
    if (buttonElement) {
      const isDisabled = await buttonElement.evaluate(
        (button) => button.disabled
      );
      await buttonElement.evaluate((button) =>
        console.log("status: ", button.disabled)
      );
      return isDisabled;
    } else {
      return true;
    }
  }

  async function isElementPresent(selector) {
    console.log("isElementPresent called!!!!!");
    return await page.evaluate((sel) => {
      console.log({ sel }, document.getElementsByClassName(sel)[0]);
      return !!document.getElementsByClassName(sel)[0];
    }, selector);
  }
  // Launch a headless browser
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

  await delay(3000);

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

  await page.waitForSelector("a"); // Wait for the first link to be available
  await page.click("a");

  await page.waitForNavigation({ waitUntil: "networkidle0" });

  // At this point, the page has completed navigation (including any redirects)
  console.log("Page has finished navigating.");

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

  const h2Element = await page.$x("//h2[contains(text(), 'Migration')]");
  await delay(1000);

  console.log(h2Element);
  // If the h2 element is found, click on it
  if (h2Element.length > 0) {
    await h2Element[1].click();
    console.log("Clicked on the 'Migration' h2 element.");
  } else {
    console.log("Could not find the 'Migration' h2 element.");
  }

  // Assuming the drop-down element has a specific class name
  const dropDownClassName = ".mat-mdc-autocomplete-panel .mat-mdc-option";

  await page.waitForNavigation({ waitUntil: "networkidle0" });
  await page.evaluate(() => {
    const element = document.getElementsByClassName(
      "mat-mdc-input-element mat-mdc-autocomplete-trigger ng-tns-c13-2 mat-mdc-form-field-input-control mdc-text-field__input ng-pristine ng-invalid cdk-text-field-autofill-monitored ng-touched"
    )[0];
    if (element) {
      element.click();
    } else {
      console.log("Could not find the element for dropdown");
    }
  });

  await delay(1000);

  // Find the input field by its placeholder text
  const inputField = await page.$(
    'input[placeholder="Please enter bucket name"]'
  );

  page.evaluate(() => {
    const d = new Date();

    bucketName =
      "bucket_" + d.toISOString().split("-").join("").split("T")[0] + "_mig";

    console.log("reached the page we wanted");
    console.log({ bucketName });
    const inputField = document.getElementById("migration_bucket_name");
    if (inputField) {
      inputField.value = bucketName; // Replace 'your_bucket_name' with the actual bucket name you want to enter
      inputField.innerText = bucketName; // Replace 'your_bucket_name' with the actual bucket name you want to enter
      inputField.dispatchEvent(
        new Event("input", { bubbles: true, cancelable: true })
      );
    } else {
      console.log("Input field not found!");
    }
  });

  await delay(1000);
  //   Execute the first JavaScript code within the page context
  await page.evaluate(() => {
    const element = document.getElementsByClassName(
      "mat-mdc-input-element mat-mdc-autocomplete-trigger ng-tns-c13-2 mat-mdc-form-field-input-control mdc-text-field__input cdk-text-field-autofill-monitored"
    )[0];

    console.log("in the drop down selection part");
    if (element) {
      element.click();
    } else {
      console.error("Element not found.");
    }
  });
  await delay(1000);

  // Wait for a short time (if needed) to allow the dropdown to appear and the next element to be available

  // Execute the second JavaScript code within the page context after clicking the first element
  await page.evaluate(() => {
    const secondElement = document.getElementsByClassName(
      "mdc-list-item__primary-text"
    )[0];
    if (secondElement) {
      secondElement.click();
    } else {
      console.error("Second element not found.");
    }
  });

  await delay(1000);

  const [previewElement] = await page.$x('//span[contains(text(), "Preview")]');
  if (previewElement) {
    await previewElement.click();
    console.log("Clicked on the element with 'Preview' as inner text.");
  } else {
    console.error("Element with 'Preview' not found.");
  }

  await delay(3000);

  const [infraSetupElement] = await page.$x(
    '//span[contains(text(), "Infra Setup")]'
  );
  if (infraSetupElement) {
    await infraSetupElement.click();
    console.log("Clicked on the element with 'Infra setup' as inner text.");
  } else {
    console.error("Element with 'Infra setup' not found.");
  }

  // await page.content();
  await delay(10000);

  const buttonElement = await page.$x(
    '//div[contains(text(), "Schema Migration")]'
  )[0];
  // await isElementPresent(
  //   "button migration-button mdc-button mdc-button--raised mat-mdc-raised-button mat-primary mat-mdc-button-base"
  // );

  console.log({ buttonElement });
  let isDisabled = await checkDisabled(buttonElement);

  console.log({ isDisabled }, "1");
  while (isDisabled) {
    const [refreshButton] = await page.$x(
      '//span[contains(text(), "Refresh")]'
    );

    if (refreshButton) {
      await refreshButton.click();
      console.log("Clicked on the element refreshButton.");
    } else {
      console.error("Element refreshButton not found.");
    }

    await delay(3000);

    page.on("response", async (response) => {
      if (!isDisabled) return;
      const request = response.request();

      if (
        request.resourceType() === "xhr" ||
        request.resourceType() === "fetch"
      ) {
        const url = response.url();
        const status = response.status();
        const contentType = response.headers()["content-type"];

        if (contentType && contentType.includes("application/json")) {
          const responseBody = await response.json();
          console.log(
            `Intercepted JSON response from ${url} - Status: ${status}`
          );
          console.log({ responseBody });
          if (!isDisabled) return;

          // Filter and print jobs with specific criteria
          responseBody?.forEach((project) => {
            project.jobs.forEach((job) => {
              if (
                job.jobType === "Infra Deployment" &&
                job.jobStatus === "Successful"
              ) {
                console.log("DONE!!!!!");
                isDisabled = false;
              }
            });
          });
        }
      }
    });
  }
  console.log({ isDisabled }, "3");

  schemaMigrationProcess(page);
  // Do any further interactions or operations on the page here...

  // Close the browser
  //   await browser.close();
})();
