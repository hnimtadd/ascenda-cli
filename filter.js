import DateParse from "./utils.js";

const DefaultConfig = {
  CheckinDate: DateParse("2019-12-25"),
  NumReturn: 2,
  ValidDayDuration: 5,
  CategoryMap: new Map([
    [1, "Restaurant"],
    [2, "Retail"],
    [4, "Activity"],
  ]),
};

/**
 * JSONFilter
 **/
class JSONFilter {
  cfg;
  pre_filters;
  constructor() {
    var cfg = DefaultConfig;
    this.pre_filters = [this.DefaultCategoryFilter, this.DefaultTimeValidator];
    this.cfg = cfg;
  }

  /**
   * Filters the data and returns a list of valid offers with predefined filters and the logic of the process.
   * If filters and process are not passed into the function, this will use prefilters and the DefaultProcess of this class.
   *
   * Returns: List(offer)
   **/
  Filter({ data, prefilters, process, config }) {
    var map = [];

    // process provided params
    if (!prefilters) {
      prefilters = this.pre_filters;
    }

    if (!process) {
      process = this.DefaultProcess;
    }
    config = this.DefaultProcessConfig(this.cfg, config);

    try {
      data.offers.forEach((offer) => {
        for (const filter of prefilters) {
          if (!filter(offer, config)) {
            return;
          }
        }

        map = process(offer, config, map);
      });
      return map;
    } catch (err) {
      if (err) {
        throw err;
      }
    }
  }

  /**
   * DefaultProcessConfig will perform a right-join on $default_config and $custom_config.
   *
   * Return: Config
   **/
  DefaultProcessConfig = (default_config, custom_config) => {
    return {
      CheckinDate: custom_config?.CheckinDate || default_config.CheckinDate,
      NumReturn: custom_config?.NumReturn || default_config.NumReturn,
      ValidDayDuration:
        custom_config?.ValidDayDuration || default_config.ValidDayDuration,
      CategoryMap: custom_config?.CategoryMap || default_config.CategoryMap,
    };
  };

  /**
   * DefaultProcess checks if the offer could be inserted into the map or if an element in the map should be replaced, and then processes the map.
   *
   * Return: Processed map
   **/
  DefaultProcess = (offer, config, map) => {
    var merchant = undefined;
    if (!offer?.merchants) {
      return;
    }

    offer.merchants.forEach((mc) => {
      if (merchant == undefined) {
        merchant = mc;
        return;
      }
      if (
        merchant?.distance &&
        mc?.distance &&
        mc.distance < merchant.distance
      ) {
        merchant = mc;
        return;
      }
      return;
    });

    if (!merchant) {
      return false;
    }

    offer.merchants = [merchant];

    var idx = -1;
    var dup = false;

    for (let i = 0; i < map.length; i++) {
      if (offer?.category == map[i]?.category) {
        dup = true;
        if (merchant.distance < map[i].merchants[0].distance) {
          idx = i;
          break;
        }
        return map;
      }

      if (merchant.distance < map[i].merchants[0].distance) {
        if (idx == -1) {
          idx = i;
          continue;
        }

        if (idx != -1) {
          if (map[i].merchants[0].distance > map[idx].merchants[0].distance) {
            idx = i;
          }
        }
      }
    }

    if (!dup && map.length < config.NumReturn) {
      map.push(offer);
      return map;
    }

    if (idx != -1) {
      map[idx] = offer;
      return map;
    }

    return map;
  };

  /**
   * DefaultCategoryFilter filters the offer,
   * Returns a boolean value indicating whether the offer's category exists in config.CategoryMap.
   *
   * Returns: Boolean
   **/
  DefaultCategoryFilter = (offer, config) => {
    if (!offer?.category) {
      return false;
    }

    var category = parseInt(offer.category, 10);
    if (category == undefined || !config.CategoryMap.has(category)) {
      return false;
    }
    return true;
  };

  /**
   * DefaultTimeValidator filters the offer.
   * Returns a boolean value indicating whether the offer is still valid after $config.ValidDayDuration from $config.CheckinDate.
   *
   * Returns: Boolean
   **/
  DefaultTimeValidator = (offer, config) => {
    if (!offer?.valid_to) {
      return false;
    }

    var valid_day = new Date();
    var checkin_day = new Date();
    try {
      valid_day = offer.valid_to;
      checkin_day = config.CheckinDate;
    } catch (err) {
      if (err) {
        throw err;
      }
    }
    if (
      parseInt((valid_day - checkin_day) / (24 * 60 * 60 * 1000), 10) <
      config.ValidDayDuration
    ) {
      return false;
    }
    return true;
  };
}
export default JSONFilter;
