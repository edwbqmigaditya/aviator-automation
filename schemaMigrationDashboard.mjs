import { dataMigrationDashboard } from "./dataMigrationDashboard.mjs";

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

export const schemaMigrationDashboard = async (page) => {
  await delay(3000);

  //Code starts here
  const elementInnerTextToMatch = "Dashboard";
  const elementClassNameToMatch = "mdc-button__label";

  await page.evaluate(
    (innerTextToMatch, classNameToMatch) => {
      const elements = Array.from(document.querySelectorAll("span"));
      const matchingElement = elements.find(
        (element) =>
          element.innerText === innerTextToMatch &&
          element.classList.contains(classNameToMatch)
      );

      if (matchingElement) {
        matchingElement.click();
      }
    },
    elementInnerTextToMatch,
    elementClassNameToMatch
  );

  await delay(2000);

  const schemaMigrationElementInnerTextToMatch =
    "Schema Migration & Validation Dashboard";

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

  await delay(15000);

  await page.evaluate(() => {
    document.getElementsByClassName("mdc-button__label")[3].click();
  });

  dataMigrationDashboard(page);
};
