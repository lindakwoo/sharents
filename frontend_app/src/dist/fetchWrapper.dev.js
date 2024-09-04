"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var customFetch = function customFetch(url) {
  var options,
      accessToken,
      fetchOptions,
      response,
      data,
      _args = arguments;
  return regeneratorRuntime.async(function customFetch$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
          accessToken = localStorage.getItem("access_token");
          fetchOptions = _objectSpread({}, options, {
            headers: _objectSpread({}, options.headers, {
              "Content-Type": "application/json",
              Authorization: "Bearer ".concat(accessToken)
            })
          });
          _context.prev = 3;
          _context.next = 6;
          return regeneratorRuntime.awrap(fetch(url, fetchOptions));

        case 6:
          response = _context.sent;

          if (!(response.status === 204)) {
            _context.next = 9;
            break;
          }

          return _context.abrupt("return", {});

        case 9:
          if (response.ok) {
            _context.next = 11;
            break;
          }

          throw new Error("HTTP error! status: ".concat(response.status));

        case 11:
          _context.prev = 11;
          _context.next = 14;
          return regeneratorRuntime.awrap(response.json());

        case 14:
          data = _context.sent;
          return _context.abrupt("return", data);

        case 18:
          _context.prev = 18;
          _context.t0 = _context["catch"](11);
          // Handle cases where response is not valid JSON
          console.error("Failed to parse JSON:", _context.t0);
          throw new Error("Response is not valid JSON");

        case 22:
          _context.next = 28;
          break;

        case 24:
          _context.prev = 24;
          _context.t1 = _context["catch"](3);
          console.error("Error during fetch:", _context.t1);
          throw _context.t1;

        case 28:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 24], [11, 18]]);
};

var _default = customFetch;
exports["default"] = _default;