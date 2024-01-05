function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

export const edwModernization = async (page) => {

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

  await delay(3000)
  await page.click('input[placeholder="Select Project"]');


  // Click on the first element of the array
  const elements = await page.$$('.mdc-list-item__primary-text');
  if (elements.length > 0) {
    await elements[0].click();
  } else {
    console.error('No elements found with the specified class.');
  }

  await delay(2000)

  // Click on the button with inner text "Select Services"
  const buttonSelector = await page.$x('//span[contains(text(), "Select Services")]');
  if (buttonSelector.length > 0) {
    await buttonSelector[0].click();
  } else {
    console.error('Button with specified inner text not found.');
  }


  await delay(2000)
  const h2Element = await page.$x(
    "//h2[contains(text(), 'EDW Modernization')]"
  );
  await delay(1000);

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

  // // this is the upload code for edw excel file

  // const fileInput = await page.$('input[type="file"]');
  // console.log(fileInput);
  // const filePath = "./EDW Modernization Template.xlsx"; // Replace with the local file path you want to upload
  // await fileInput.uploadFile(filePath);
  // await delay(1000);

  // const [previewElement] = await page.$x('//span[contains(text(), "Preview")]');
  // if (previewElement) {
  //   await previewElement.click();
  //   console.log("Clicked on the element with 'Preview' as inner text.");
  // } else {
  //   console.error("Element with 'Preview' not found.");
  // }

  // await delay(3000);
  // await page.evaluate(() => {
  //   const button = document.getElementsByClassName(
  //     "right-icon next button mdc-button mdc-button--raised mat-mdc-raised-button mat-primary mat-mdc-button-base"
  //   )[0];

  //   if (button) button.click();
  // });
  // await delay(5000);

  // await page.evaluate(() => {
  //   const button = document.getElementsByClassName(
  //     "right-icon next button mdc-button mdc-button--raised mat-mdc-raised-button mat-primary mat-mdc-button-base"
  //   )[0];

  //   if (button) button.click();
  // });




  await page.evaluate(() => {
    const button = document.getElementsByClassName("mdc-switch__track")[0]

    if (button) button.click();
  });

  const translateButtonSelector = await page.$x('//span[contains(text(), "Translate")]');
  if (translateButtonSelector.length > 0) {
    await translateButtonSelector[0].click();
  } else {
    console.error('Button with specified inner text not found.');
  }

  const validateQueryEDWButton = await page.$x('//span[contains(text(), "Validate Query")]');
  if (validateQueryEDWButton.length > 0) {
    await validateQueryEDWButton[0].click();
  } else {
    console.error('Button with specified inner text not found.');
  }





  const validateDataSourceButton = await page.$x('//span[contains(text(), "Validate Source Dataset")]');
  if (validateDataSourceButton.length > 0) {
    await validateDataSourceButton[0].click();
  } else {
    console.error('Button with specified inner text not found.');
  }






  const confirmEDWButton = await page.$x('//span[contains(text(), "Confirm")]');
  if (confirmEDWButton.length > 0) {
    await confirmEDWButton[0].click();
  } else {
    console.error('Button with specified inner text not found.');
  }






  const modernizeEDWButton = await page.$x('//span[contains(text(), "Modernize")]');
  if (modernizeEDWButton.length > 0) {
    await modernizeEDWButton[0].click();
  } else {
    console.error('Button with specified inner text not found.');
  }


  await delay(3000);

  console.log("My Script here is done!!!!!");
};
