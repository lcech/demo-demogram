/*global digitalData,_satellite*/
var digitalData = digitalData || {};
digitalData._log = digitalData._log || [];

var debug = function () {
  if (! window.console || ! console.log) {
    return;
  }
  return Function.prototype.bind.call(console.log, console);
} ();
/**
 * Update the Instance Variable with the new functionality
 * @param measure {function} The original function with page data
 * @param measure.q {Array}
 */
var measure = (function (measure) {
  /**
   * New function to operate the gathered data
   * @method measureInterface
   * @param data {object} Object with data to measure
   */
  var measureInterface = function (data) {
    if (typeof data.event !== "undefined") {
      measureInterface._fired = true;
      digitalData = measureInterface._deepMerge(digitalData, data);
      data._timestamp = new Date().getTime();
      digitalData._log.push(data);
      measureInterface._process(data);
    } else {
      throw "Missing Event ID";
    }
  };

  /**
   * Fired flag to fallback to the automatic URL-based measurement
   * @private
   */
  measureInterface._fired = false;

  /**
   * Function to merge objects recursively
   * @param target
   * @param src
   * @returns {boolean|*|Boolean|Array|{}}
   * @private
   */
  measureInterface._deepMerge = function (target, src) {
    var array = Array.isArray(src);
    var dst = array && [] || {};

    if (array) {
      target = target || [];
      dst = dst.concat(target);
      src.forEach(function(e, i) {
        if (typeof dst[i] === "undefined") {
          dst[i] = e;
        } else if (typeof e === "object") {
          dst[i] = measureInterface._deepMerge(target[i], e);
        } else {
          if (target.indexOf(e) === -1) {
            dst.push(e);
          }
        }
      });
    } else {
      if (target && typeof target === "object") {
        Object.keys(target).forEach(function (key) {
          dst[key] = target[key];
        })
      }
      Object.keys(src).forEach(function (key) {
        if (typeof src[key] !== "object" || !src[key]) {
          dst[key] = src[key];
        }
        else {
          if (!target[key]) {
            dst[key] = src[key];
          } else {
            dst[key] = measureInterface._deepMerge(target[key], src[key]);
          }
        }
      });
    }

    return dst;
  };

  /**
   * Default measure process function to override
   * @method _process
   * @private
   * @param data {object} Object with data to measure
   * @param data.contact {String}
   * @param data.error {String}
   * @param data.fileNAme {String}
   * @param data.username {String}
   */
  measureInterface._process = function (data) {
    var digitalDataSnapshot;
    digitalDataSnapshot = JSON.parse(JSON.stringify(digitalData));
    delete digitalDataSnapshot._log;
    debug("Event captured. Available data:");
    debug(JSON.stringify(digitalDataSnapshot, null, 4));
    debug("---------------------------------------------");
    /*
    switch (data.event) {
    case "pageview":
      if (data.error) {
        //do nothing
      }
      _satellite.pageBottom();
      break;
    case "leadFormSent":
    case "loginFormSent":
    case "contactFormSent":
    case "fileDownload":
      _satellite.track(data.event);
      break;
    }
    */
  };
  return measureInterface;
}(measure));
