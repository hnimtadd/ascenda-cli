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
  FlagInputFile,
  FlagOutputFile,
} from "./types.js";

var config = {
  InputFile: "./input.json",
  OutputFile: "./output.json",
};
/**
 * Parse argv and get predefined config
 **/
const parseArgv = () => {
  var argvs = process.argv.slice(2);
  const map = new Parser({
    flags: [
      FlagCheckIn,
      FlagNumReturn,
      FlagValidDuration,
      FlagHelp,
      FlagInputFile,
      FlagOutputFile,
    ],
  }).Parse(argvs);

  map.forEach((value, key) => {
    switch (key) {
      case FlagCheckIn:
        try {
          var date = ParseDate(value);
          config.CheckinDate = date;
          return;
        } catch (error) {
          console.log("checkin date not valid, using default", error);
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
      case FlagInputFile:
        config.InputFile = value;
        return;
      case FlagOutputFile:
        config.OutputFile = value;
        return;
      case FlagHelp:
        console.log(key);
        PrintHelp();
        exit();
    }
  });
  return config;
};

/**
 * Print help and exit
 **/
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
    // Read "./input.json" file and process filter on file's data.
    fs.readFile(config.InputFile, (err, data) => {
      if (err) {
        throw err;
      }
      const jsonFilter = new JSONFilter();
      const json = JSON.parse(data);
      const offers = jsonFilter.Filter({
        data: json,
        config: config,
      });

      // Write result to "./output.json" file
      const jsonBody = JSON.stringify({ offers: offers }, null, 2);
      fs.writeFile(config.OutputFile, jsonBody, (err) => {
        if (err) {
          exit(err);
        }
        console.log("success, output writen to", config.OutputFile);
      });
    });
  } catch (err) {
    exit(err);
  }
}

main();
