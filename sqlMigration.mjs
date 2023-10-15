import { edwModernization } from "./edwModernization.mjs";

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

export const sqlMigration = async (page) => {
  await delay(2000);
  const [sqlMigrationButton] = await page.$x(
    '//div[contains(text(), "SQL Migration")]'
  );

  if (sqlMigrationButton) {
    await sqlMigrationButton.click();
    console.log("Clicked on the element with 'sql Migration' as inner text.");
  } else {
    console.error("Element with 'sql Migration' not found.");
  }

  await page.waitForNavigation({ waitUntil: "networkidle0" });

  const [nextSQLMigrationButton] = await page.$x(
    '//span[contains(text(), "Next")]'
  );

  if (nextSQLMigrationButton) {
    await nextSQLMigrationButton.click();
    console.log("Clicked on the element with 'Next' button ");
  } else {
    console.error("Element with 'Next' button not found.");
  }
  await delay(2000);

  const dataTransferInput = await page.$('input[type="file"]');
  console.log(dataTransferInput);
  const dataTransferfilePath = "./Sql Migration Template.xlsx"; // Replace with the local file path you want to upload
  await dataTransferInput.uploadFile(dataTransferfilePath);
  await delay(1000);

  const [sqlMigrationSkipButton] = await page.$x(
    "//span[contains(text(), 'Skip')]"
  );
  console.log({ sqlMigrationSkipButton });

  if (sqlMigrationSkipButton) {
    await sqlMigrationSkipButton.click();
    console.log("Clicked on the element with 'sqlMigrationSkipButton' button ");
  } else {
    console.error("Element with 'sqlMigrationSkipButton' button not found.");
  }

  await delay(3000);

  page.evaluate(async () => {
    const [startSQLMigrationButton] = document.getElementsByClassName(
      "right-icon next button mdc-button mdc-button--raised mat-mdc-raised-button mat-primary mat-mdc-button-base"
    );
    if (startSQLMigrationButton) {
      await startSQLMigrationButton.click();
      console.log(
        "Clicked on the element with 'startSQLMigrationButton' button "
      );
    } else {
      console.error("Element with 'startSQLMigrationButton' button not found.");
    }
  });
  await delay(6000);

  edwModernization(page);
};
