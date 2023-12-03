import { FlagHelp } from "./types.js";
class Parser {
  constructor({ flags }) {
    this.flags = [];
    if (flags) {
      this.flags = flags;
    }
  }

  Parse(argvs) {
    var map = new Map();
    var flag = "";
    for (const ele of argvs) {
      if (ele[0] == "-") {
        if (ele == FlagHelp) {
          map.set(ele, "");
          continue;
        }
        flag = ele;
        continue;
      }
      if (flag == "") {
        throw new Error("unknow: ", ele, "--help for help");
      } else {
        if (this.flags.includes(flag) || !this.flags.length) {
          map.set(flag, ele);
        }
        flag = "";
      }
    }
    return map;
  }
}

export default Parser;
