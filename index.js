import fs from "fs";
import { exit } from "process";

import ParseDate from "./utils.js";
import JSONFilter from "./filter.js";
import Parser from "./parser.js";
import {
  FlagHelp,
  FlagCheckIn,
  FlagNumReturn,
  FlagValidDuration,
} from "./types.js";

var config = {};
/**
 * Parse argv and get predefined config
 **/
const parseArgv = () => {
  var argvs = process.argv.slice(2);
  const map = new Parser({
    flags: [FlagCheckIn, FlagNumReturn, FlagValidDuration, FlagHelp],
  }).Parse(argvs);

  map.forEach((value, key) => {
    switch (key) {
      case FlagCheckIn:
        try {
          date = ParseDate(value);
          config.CheckinDate = date;
          return;
        } catch (error) {
          console.log("checkin date not valid, using default");
          return;
        }
      case FlagNumReturn:
        const NumReturn = parseInt(value, 10);
        if (isNaN(NumReturn)) {
          console.log("--flag num-return invalid, using default value.");
        }
        config.NumReturn = NumReturn;
        return;
      case FlagValidDuration:
        const ValidDayDuration = parseInt(value, 10);
        if (isNaN(ValidDayDuration)) {
          console.log("--flag valid-duration invalid, using default value.");
        }
        config.ValidDayDuration = ValidDayDuration;
        return;
      case FlagHelp:
        console.log(key);
        PrintHelp();
        exit();
    }
  });
  return config;
};

const PrintHelp = () => {
  console.log("Command: ./cli --check-in [date] [Options]");
  console.log(
    "\t--check-in: (required), customer's checkin day in format 'YYYY-mm-dd'",
  );
  console.log("Option:");
  console.log("\t--num-return: number of offers to be return");
  console.log(
    "\t--valid-duration: number of day that the offers need to be valid_to",
  );
  console.log("\t--help: print this help");
};

function main() {
  config = parseArgv();

  try {
    fs.readFile("./input.json", (err, data) => {
      if (err) {
        throw err;
      }
      const jsonFilter = new JSONFilter();
      const json = JSON.parse(data);
      const offers = jsonFilter.Filter({
        data: json,
        config: config,
      });

      const jsonBody = JSON.stringify({ offers: offers }, null, 2);
      fs.writeFile("./output.json", jsonBody, (err) => {
        if (err) {
          console.log(err);
        }
      });
      console.log(jsonBody);
    });
  } catch (err) {
    exit(err);
  }
}

main();
