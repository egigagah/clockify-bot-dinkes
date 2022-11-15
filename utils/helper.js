import { readFileSync } from "fs";
import { load } from "js-yaml";
import logger from "./logger";
import ora from "ora";

export function CheckCredentials(EMAIL, PASSWORD,) {
  if (EMAIL) {
    ora(logger.white("  Email")).succeed();
  } else {
    ora(logger.white("  Email")).fail();
  }
  if (PASSWORD) {
    ora(logger.white("  Password")).succeed();
  } else {
    ora(logger.white("  Password")).fail();
  }
}

export function CheckData() {
  try {
    let fileContents = readFileSync("./data.yml", "utf-8");
    const data = load(fileContents);

    if (data) {
      ora(logger.white("  Data")).succeed();
      return data;
    }
    
  } catch (e) {
    logger(e);
  }
  ora(logger.white("  Data")).fail();
  return;
}