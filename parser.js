import { FlagHelp } from "./types.js";
class Parser {
  /**
   *
   * Constructor constructs a parse class with given flags. These flags will be used later to parse the argvs.
   **/
  constructor({ flags }) {
    this.flags = [];
    if (flags) {
      this.flags = flags;
    }
  }

  /**
   * Parse will parse argvs, return map values of given flags and coressponding value
   *
   * Returns: Map<types.Flag, string>
   * */
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
