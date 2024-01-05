import { sqlMigration } from "./sqlMigration.mjs";

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

async function refreshStatusFunction(page) {
  console.log("step 1");
  await delay(3000);
  return await page.evaluate(async function () {
    let final = [];
    console.log("inside page evaluate");
    let tableObjects = [];

    let tableElements = document.getElementsByClassName("job-table");

    for (let tableElement of tableElements) {
      let rows = tableElement.getElementsByTagName("tr");

      let tableData = {};

      let d = {};
      let x = [];
      for (let i = 0; i < rows.length; i++) {
        let headerCells = Array.from(tableElement.getElementsByTagName("th"));
        let dataCells = Array.from(tableElement.getElementsByTagName("td"));

        console.log({ dataCells });
        if (i === 0) {
          headerCells.forEach((el) => {
            d[el.innerText] = undefined;
            x.push(el.innerText);
          });
        } else {
          console.log(
            dataCells.forEach((el, index) => (d[x[index]] = el.innerText))
          );
        }
      }

      final.push(d);

      tableObjects.push(tableData);
    }
    console.log({ final });
    return final;
  });
}

export const schemaMigrationProcess = async (page) => {
  async function isElementPresent(selector) {
    return await page.evaluate((sel) => {
      return !!document.getElementsByClassName(sel)[0];
    }, selector);
  }

  async function clickDownArrowButton() {
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

  const isElementPresentBool = await isElementPresent(
    "button migration-button mdc-button mdc-button--raised mat-mdc-raised-button mat-primary mat-mdc-button-base"
  );

  console.log({ isElementPresentBool });
  await delay(3000);
  const [schemaMigrationButton] = await page.$x(
    '//div[contains(text(), "Schema Migration")]'
  );

  if (schemaMigrationButton) {
    await schemaMigrationButton.click();
    console.log(
      "Clicked on the element with 'schema Migration' as inner text."
    );
  } else {
    console.error("Element with 'Schema Migration' not found.");
  }

  await delay(2000);

  const [nextSchemaMigrationButton] = await page.$x(
    '//span[contains(text(), "Next")]'
  );

  if (nextSchemaMigrationButton) {
    await nextSchemaMigrationButton.click();
    console.log("Clicked on the element with 'Next' button ");
  } else {
    console.error("Element with 'Next' button not found.");
  }
  await delay(2000);

  const fileInput = await page.$('input[type="file"]');
  console.log(fileInput);
  const filePath = "./Schema Migration Template.xlsx"; // Replace with the local file path you want to upload
  await fileInput.uploadFile(filePath);
  await delay(1000);

  const [skipButton] = await page.$x("//span[contains(text(), 'Skip')]");
  console.log({ skipButton });

  if (skipButton) {
    await skipButton.click();
    console.log("Clicked on the element with 'Skip' button ");
  } else {
    console.error("Element with 'Skip' button not found.");
  }
  await delay(3000);

  await page.evaluate(() => {
    console.log("inside the code for schema migration");
    const element = document.getElementsByClassName(
      "right-icon next button mdc-button mdc-button--raised mat-mdc-raised-button mat-primary mat-mdc-button-base"
    )[0];

    console.log("clicked on schema migration button");
    if (element) {
      element.click();
    } else {
      console.error("Element not found.");
    }
  });

  await delay(15000);
  let planeIconDisabled = true;

  while (planeIconDisabled) {
    await clickDownArrowButton();
    page.on("response", async (response) => {
      if (!planeIconDisabled) return;
      const urlToMonitor = "https://34.121.80.106:8432/schemadatajob/2";
      const request = response.request();

      if (
        request.resourceType() === "xhr" ||
        request.resourceType() === "fetch"
      ) {
        const url = response.url();
        const contentType = response.headers()["content-type"];
        if (url === urlToMonitor && contentType.includes("application/json")) {
          const responseBody = await response.json();
          console.log({ responseBody });
          responseBody?.forEach(async (job) => {
            if (
              job.jobType === "Schema Migration" &&
              job.jobStatus === "Successful"
            ) {
              planeIconDisabled = false;
              console.log("Schema Migration job is successful.");
            }
          });
        }
      }
    });

    await delay(3000);

    if (planeIconDisabled) await clickDownArrowButton();
  }

  await delay(1000);

  page.evaluate(() => {
    let selectedDiv = [
      ...document.getElementsByClassName("planes-view"),
    ].filter((el) => el.innerText === "Data Migration & Validation")[0];

    if (selectedDiv && selectedDiv.children && selectedDiv.children[0]) {
      selectedDiv.children[0].click();
    } else {
      console.log("data migration and validation not found");
    }
  });

  await delay(2000);

  const [nextDataMigrationButton] = await page.$x(
    '//span[contains(text(), "Next")]'
  );

  if (nextDataMigrationButton) {
    await nextDataMigrationButton.click();
    console.log("Clicked on the element with 'Next' button ");
  } else {
    console.error("Element with 'Next' button not found.");
  }
  await delay(3000);

  const dataTransferInput = await page.$('input[type="file"]');
  console.log(dataTransferInput);
  const dataTransferfilePath = "./Data Transfer Template.xlsx"; // Replace with the local file path you want to upload
  await dataTransferInput.uploadFile(dataTransferfilePath);
  await delay(1000);

  const [dataMigrationSkipButton] = await page.$x(
    "//span[contains(text(), 'Skip')]"
  );
  console.log({ dataMigrationSkipButton });

  if (dataMigrationSkipButton) {
    await dataMigrationSkipButton.click();
    console.log(
      "Clicked on the element with 'dataMigrationSkipButton' button "
    );
  } else {
    console.error("Element with 'dataMigrationSkipButton' button not found.");
  }

  const [startDataMigrationButton] = await page.$x(
    '//span[contains(text(), "Start Data Migration")]'
  );

  if (startDataMigrationButton) {
    await startDataMigrationButton.click();
    console.log(
      "Clicked on the element with 'startDataMigrationButton' as inner text."
    );
  } else {
    console.error("Element with 'startDataMigrationButton' not found.");
  }

  let jobInProgress = true;
  while (jobInProgress) {
    if (!jobInProgress) return;
    await clickDownArrowButton();

    const dataArray = await refreshStatusFunction(page);

    const filteredArray = dataArray.filter((entry) => {
      return (
        entry["Job Type"] === "Data Migration" &&
        entry["Job Status"] === "Successful"
      );
    });

    if (filteredArray.length > 0) {
      console.log("Data Migration with Successful status found.");
      console.log("Matching entries:", filteredArray);
      jobInProgress = false;
    } else {
      console.log("No Data Migration with Successful status found.");
    }

    await delay(3000);

    if (jobInProgress) await clickDownArrowButton();

    await delay(4000);
  }
  sqlMigration(page);
};
