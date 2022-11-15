import logger from "./utils/logger";
import ora from "ora";
import { chromium } from "playwright";
import { BASE_URL } from "./utils/contsants";
import * as dotenv from 'dotenv';
import { CheckData, CheckCredentials } from "./utils/helper"

dotenv.config();
const { EMAIL, PASSWORD } = process.env;

const info =
  logger.whiteBold("[") + logger.yellowBold("!") + logger.whiteBold("] ");

logger(info + logger.whiteBold("Requirements"));

CheckCredentials(EMAIL, PASSWORD)
const data = CheckData();

if (!data || !EMAIL || !PASSWORD) {
  logger("");
  logger(`${logger.redBold("Check the requirements!")}`);
  // browser.close();
  process.exit();
}

(async () => {
  const spinner = [];
  logger("");
  logger(info + logger.whiteBold("Opening browser"));
  const browser = await chromium.launch({ headless: false,  });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.setViewportSize({ width: 1440, height: 711 })
  const navigationPromise = page.waitForNavigation({timeout: 5000});

  try {
    logger(
      info + logger.whiteBold("Redirecting to " + logger.yellowBold(BASE_URL))
    );
    await page.goto(BASE_URL, {waitUntil: "networkidle"});
    if(page.url().match(/login/g)) {
      try {
        await page.waitForSelector('#email')
        await page.fill("input#email", EMAIL)

        await page.waitForSelector('#password')
        await page.fill("input#password", PASSWORD)
        await page.click('[type="submit"]');

        const error = await page.waitForSelector("div.cl-invalid-feedback", {timeout: 1500}).catch(() => null)
        if(error) {
          throw Error(await error.innerText() || "Credentials invalid")
        }

        logger("");
        logger(info + logger.whiteBold("Performing automation"));
        
        try {
          await page.waitForURL("https://app.clockify.me/tracker", {waitUntil: "load", timeout: 3000})

          for (let idx = 0; idx < data.length; idx++) {
          // data.forEach(async (d) => {
            // data[idx].tracker.forEach(async (track) => {
            const tracker = data[idx].tracker;
            for (let trackIdx = 0; trackIdx < tracker.length; trackIdx++) {
              await (await page.waitForSelector("project-picker-label")).click()
              await page.locator(`button[title="${tracker[trackIdx].project}"]`).first().click()
      
              await page.waitForSelector('input[name="autocomplete-input"]')
              await page.fill('input[name="autocomplete-input"]', tracker[trackIdx].task)
      
              await page.locator("div.cl-timetracker-entry-actions > div > tag-names").first().click()

              tracker[trackIdx].tags.forEach(async (item) => {
                await page.locator(`label:has-text("${item}")`).click()
              })
      
              await page.fill("input-time-ampm.cl-text-right > input", tracker[trackIdx].time_from)
              await page.locator("input-time-ampm >> nth=1").locator("input").fill(tracker[trackIdx].time_to)

              await page.fill("input.cl-input-date-picker", data[idx].date)
      
              await page.locator("div[data-cy='add-btn']").click();
      
              const response = await page.waitForResponse(response => response.url() === "https://global.api.clockify.me/workspaces/6321c38f0ea12c67df21a7fb/timeEntries/full" && response.status() === 201).then(() => true).catch(() => false)
  
              console.log(response, "-- res")
              if(!response) throw Error(`Failed ${data[idx].date}`)
              ora(logger.white(`  insert data ${data[idx].date}`)).succeed();
            }
          };

          logger("");
          logger(
            logger.whiteBold("[") +
              logger.yellowBold("!") +
              logger.whiteBold("] Automation Finished")
          );
        // setTimeout(async () => {
          await browser.close();
        // }, 5000)
        } catch (error) {
          ora(logger.white(`  ${error}`)).fail();
          await browser.close();
        }
      } catch (error) {
        ora(logger.white(`  Login ${error}`)).fail();
        await browser.close();
      }
    }
  } catch (error) {
    ora(logger.white(`  Login ${error}`)).fail();
    await browser.close();
  }
})();