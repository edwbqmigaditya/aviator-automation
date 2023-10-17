function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

export const dataMigrationDashboard = async (page) => {
  const schemaMigrationElementInnerTextToMatch =
    "Data Migration & Validation Dashboard";

  await delay(2000);
  // Find and click the element with the specified inner text
  await page.evaluate((schemaMigrationElementInnerTextToMatch) => {
    const elements = Array.from(document.querySelectorAll("mat-card-content"));
    const matchingElement = elements.find(
      (element) => element.innerText === schemaMigrationElementInnerTextToMatch
    );
    console.log(matchingElement);

    if (matchingElement) {
      matchingElement.click();
    }
  }, schemaMigrationElementInnerTextToMatch);

  await delay(10000);

  await page.evaluate(() => {
    document.getElementsByClassName("mdc-button__label")[0].click();
  });
};
