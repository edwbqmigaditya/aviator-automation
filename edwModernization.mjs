function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

export const edwModernization = async (page) => {
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

  const h2Element = await page.$x(
    "//h2[contains(text(), 'EDW Modernization')]"
  );
  await delay(1000);

  // If the h2 element is found, click on it
  if (h2Element.length > 0) {
    await h2Element[0].click();
    console.log("Clicked on the 'EDW Modernization' h2 element.");
  } else {
    console.log("Could not find the 'EDW Modernization' h2 element.");
  }

  await delay(2000);

  const [edwModernizationNextButton] = await page.$x(
    '//span[contains(text(), "Next")]'
  );

  if (edwModernizationNextButton) {
    await edwModernizationNextButton.click();
    console.log("Clicked on the element with 'Next' button ");
  } else {
    console.error("Element with 'Next' button not found.");
  }

  const [validateSourceDatasetButton] = await page.$x(
    '//span[contains(text(), "Validate Source Dataset")]'
  );
  if (validateSourceDatasetButton) {
    await validateSourceDatasetButton.click();
    console.log(
      "Clicked on the element with 'Validate Source Dataset' as inner text."
    );
  } else {
    console.error("Element with 'Validate Source Dataset' not found.");
  }

  await delay(2000);

  const fileInput = await page.$('input[type="file"]');
  console.log(fileInput);
  const filePath = "./EDW Modernization Template.xlsx"; // Replace with the local file path you want to upload
  await fileInput.uploadFile(filePath);
  await delay(1000);

  const [previewElement] = await page.$x('//span[contains(text(), "Preview")]');
  if (previewElement) {
    await previewElement.click();
    console.log("Clicked on the element with 'Preview' as inner text.");
  } else {
    console.error("Element with 'Preview' not found.");
  }

  await delay(3000);

  // const [modernizeElement] = await page.$x(
  //   '//span[contains(text(), "Modernize")]'
  // );

  await page.evaluate(() => {
    const button = document.getElementsByClassName(
      "right-icon next button mdc-button mdc-button--raised mat-mdc-raised-button mat-primary mat-mdc-button-base"
    )[0];

    if(button) button.click()
  });
await delay(5000)

  await page.evaluate(() => {
    const button = document.getElementsByClassName(
      "right-icon next button mdc-button mdc-button--raised mat-mdc-raised-button mat-primary mat-mdc-button-base"
    )[0];

    if(button) button.click()
  });

  // if (modernizeElement) {
  //   await modernizeElement.click();
  //   console.log("Clicked on the element with 'Modernize' as inner text.");
  // } else {
  //   console.error("Element with 'Modernize' not found.");
  // }

  await delay(3000);

  console.log("My Script here is done!!!!!");
};
