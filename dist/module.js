define(["app/core/utils/datemath","lodash","moment"], function(__WEBPACK_EXTERNAL_MODULE_grafana_app_core_utils_datemath__, __WEBPACK_EXTERNAL_MODULE_lodash__, __WEBPACK_EXTERNAL_MODULE_moment__) { return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./module.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../node_modules/scriptjs/dist/script.js":
/*!***********************************************!*\
  !*** ../node_modules/scriptjs/dist/script.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
  * $script.js JS loader & dependency manager
  * https://github.com/ded/script.js
  * (c) Dustin Diaz 2014 | License MIT
  */

(function (name, definition) {
  if ( true && module.exports) module.exports = definition()
  else if (true) !(__WEBPACK_AMD_DEFINE_FACTORY__ = (definition),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
  else {}
})('$script', function () {
  var doc = document
    , head = doc.getElementsByTagName('head')[0]
    , s = 'string'
    , f = false
    , push = 'push'
    , readyState = 'readyState'
    , onreadystatechange = 'onreadystatechange'
    , list = {}
    , ids = {}
    , delay = {}
    , scripts = {}
    , scriptpath
    , urlArgs

  function every(ar, fn) {
    for (var i = 0, j = ar.length; i < j; ++i) if (!fn(ar[i])) return f
    return 1
  }
  function each(ar, fn) {
    every(ar, function (el) {
      fn(el)
      return 1
    })
  }

  function $script(paths, idOrDone, optDone) {
    paths = paths[push] ? paths : [paths]
    var idOrDoneIsDone = idOrDone && idOrDone.call
      , done = idOrDoneIsDone ? idOrDone : optDone
      , id = idOrDoneIsDone ? paths.join('') : idOrDone
      , queue = paths.length
    function loopFn(item) {
      return item.call ? item() : list[item]
    }
    function callback() {
      if (!--queue) {
        list[id] = 1
        done && done()
        for (var dset in delay) {
          every(dset.split('|'), loopFn) && !each(delay[dset], loopFn) && (delay[dset] = [])
        }
      }
    }
    setTimeout(function () {
      each(paths, function loading(path, force) {
        if (path === null) return callback()
        
        if (!force && !/^https?:\/\//.test(path) && scriptpath) {
          path = (path.indexOf('.js') === -1) ? scriptpath + path + '.js' : scriptpath + path;
        }
        
        if (scripts[path]) {
          if (id) ids[id] = 1
          return (scripts[path] == 2) ? callback() : setTimeout(function () { loading(path, true) }, 0)
        }

        scripts[path] = 1
        if (id) ids[id] = 1
        create(path, callback)
      })
    }, 0)
    return $script
  }

  function create(path, fn) {
    var el = doc.createElement('script'), loaded
    el.onload = el.onerror = el[onreadystatechange] = function () {
      if ((el[readyState] && !(/^c|loade/.test(el[readyState]))) || loaded) return;
      el.onload = el[onreadystatechange] = null
      loaded = 1
      scripts[path] = 2
      fn()
    }
    el.async = 1
    el.src = urlArgs ? path + (path.indexOf('?') === -1 ? '?' : '&') + urlArgs : path;
    head.insertBefore(el, head.lastChild)
  }

  $script.get = create

  $script.order = function (scripts, id, done) {
    (function callback(s) {
      s = scripts.shift()
      !scripts.length ? $script(s, id, done) : $script(s, callback)
    }())
  }

  $script.path = function (p) {
    scriptpath = p
  }
  $script.urlArgs = function (str) {
    urlArgs = str;
  }
  $script.ready = function (deps, ready, req) {
    deps = deps[push] ? deps : [deps]
    var missing = [];
    !each(deps, function (dep) {
      list[dep] || missing[push](dep);
    }) && every(deps, function (dep) {return list[dep]}) ?
      ready() : !function (key) {
      delay[key] = delay[key] || []
      delay[key][push](ready)
      req && req(missing)
    }(deps.join('|'))
    return $script
  }

  $script.done = function (idOrDone) {
    $script([null], idOrDone)
  }

  return $script
});


/***/ }),

/***/ "./annotations_query_ctrl.ts":
/*!***********************************!*\
  !*** ./annotations_query_ctrl.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var GoogleCalendarAnnotationsQueryCtrl =
/** @class */
function () {
  function GoogleCalendarAnnotationsQueryCtrl($scope, $injector) {
    this.scope = $scope;
  }

  GoogleCalendarAnnotationsQueryCtrl.templateUrl = 'partials/annotations.editor.html';
  return GoogleCalendarAnnotationsQueryCtrl;
}();

exports.GoogleCalendarAnnotationsQueryCtrl = GoogleCalendarAnnotationsQueryCtrl;

/***/ }),

/***/ "./datasource.ts":
/*!***********************!*\
  !*** ./datasource.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GoogleCalendarDatasource = undefined;

var _lodash = __webpack_require__(/*! lodash */ "lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _moment = __webpack_require__(/*! moment */ "moment");

var _moment2 = _interopRequireDefault(_moment);

var _datemath = __webpack_require__(/*! grafana/app/core/utils/datemath */ "grafana/app/core/utils/datemath");

var dateMath = _interopRequireWildcard(_datemath);

var _scriptjs = __webpack_require__(/*! scriptjs */ "../node_modules/scriptjs/dist/script.js");

var _scriptjs2 = _interopRequireDefault(_scriptjs);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GoogleCalendarDatasource =
/** @class */
function () {
  function GoogleCalendarDatasource(instanceSettings, $q, templateSrv, timeSrv, backendSrv) {
    this.type = instanceSettings.type;
    this.name = instanceSettings.name;
    this.id = instanceSettings.id;
    this.access = instanceSettings.jsonData.access || 'direct';
    this.clientId = instanceSettings.jsonData.clientId;
    this.scopes = 'https://www.googleapis.com/auth/calendar.readonly';
    this.discoveryDocs = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
    this.q = $q;
    this.templateSrv = templateSrv;
    this.timeSrv = timeSrv;
    this.backendSrv = backendSrv;
    this.initialized = false;
  }

  GoogleCalendarDatasource.prototype.load = function () {
    var deferred = this.q.defer();
    (0, _scriptjs2.default)('https://apis.google.com/js/api.js', function () {
      gapi.load('client:auth2', function () {
        return deferred.resolve();
      });
    });
    return deferred.promise;
  };

  GoogleCalendarDatasource.prototype.testDatasource = function () {
    return this.initialize().then(function () {
      return {
        status: 'success',
        message: 'Data source is working',
        title: 'Success'
      };
    }).catch(function (err) {
      console.log(err);
      return {
        status: "error",
        message: err.message,
        title: "Error"
      };
    });
  };

  GoogleCalendarDatasource.prototype.initialize = function () {
    var _this = this;

    if (this.access == 'proxy') {
      return Promise.resolve([]);
    }

    if (this.initialized) {
      return Promise.resolve(gapi.auth2.getAuthInstance().currentUser.get());
    }

    return this.load().then(function () {
      return gapi.client.init({
        clientId: _this.clientId,
        scope: _this.scopes,
        discoveryDocs: _this.discoveryDocs
      }).then(function () {
        var authInstance = gapi.auth2.getAuthInstance();

        if (!authInstance) {
          throw {
            message: 'failed to initialize'
          };
        }

        var isSignedIn = authInstance.isSignedIn.get();

        if (isSignedIn) {
          _this.initialized = true;
          return authInstance.currentUser.get();
        }

        return authInstance.signIn().then(function (user) {
          _this.initialized = true;
          return user;
        });
      }, function (err) {
        console.log(err);
        throw {
          message: 'failed to initialize'
        };
      });
    });
  };

  GoogleCalendarDatasource.prototype.metricFindQuery = function (query) {
    var _this = this;

    return this.initialize().then(function () {
      var timeRange = _this.timeSrv.timeRange();

      var eventsQuery = query.match(/^events\((([^,]+), *)?([^,]+), *([^,]+)\)/);

      if (eventsQuery) {
        var calendarId = eventsQuery[2];
        var fieldPath_1 = eventsQuery[3];
        var filter = eventsQuery[4];
        var params = {
          'calendarId': calendarId,
          'timeMin': timeRange.from.toISOString(),
          'timeMax': timeRange.to.toISOString(),
          'orderBy': 'startTime',
          'q': filter,
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 250
        };
        return _this.getEvents(params).then(function (events) {
          return _this.q.when(events.map(function (event) {
            return {
              text: _lodash2.default.get(event, fieldPath_1)
            };
          }));
        });
      }

      var startEndQuery = query.match(/^(start|end)\((([^,]+), *)?([^,]+), *([^,]+), *([^,]+)\)/);

      if (startEndQuery) {
        var key_1 = startEndQuery[1] === 'start' ? 'start' : 'end';
        var calendarId = startEndQuery[3];
        var format_1 = startEndQuery[4];
        var offset_1 = parseInt(startEndQuery[5], 10);
        var filter = startEndQuery[6];
        var params = {
          'calendarId': calendarId,
          'timeMin': timeRange.from.toISOString(),
          'timeMax': timeRange.to.toISOString(),
          'orderBy': 'startTime',
          'q': filter,
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 250
        };
        return _this.getEvents(params).then(function (events) {
          events.sort(function (a, b) {
            return (0, _moment2.default)(a.start.dateTime || a.start.date) > (0, _moment2.default)(b.start.dateTime || b.start.date);
          });
          var lastIndex = 0;
          var index = lastIndex - offset_1;

          if (index < 0 || index >= events.length) {
            return {};
          }

          var date = (0, _moment2.default)(events[index][key_1].dateTime || events[index][key_1].date);

          if (format_1 === 'offset' || format_1 === '-offset') {
            date = Math.floor(_moment2.default.duration(timeRange.to.diff(date)).asSeconds());

            if (format_1 === 'offset') {
              date = -date;
            }

            date = date + 's';
          } else {
            date = date.format(format_1);
          }

          return [{
            text: date
          }];
        });
      }

      var rangeQuery = query.match(/^range\((([^,]+), *)?([^,]+), *([^,]+), *([^,]+)\)/);

      if (rangeQuery) {
        var calendarId = rangeQuery[2];
        var format_2 = rangeQuery[3];
        var offset_2 = parseInt(rangeQuery[4], 10);
        var filter = rangeQuery[5];
        var params = {
          'calendarId': calendarId,
          'timeMin': timeRange.from.toISOString(),
          'timeMax': timeRange.to.toISOString(),
          'orderBy': 'startTime',
          'q': filter,
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 250
        };
        return _this.getEvents(params).then(function (events) {
          events.sort(function (a, b) {
            return (0, _moment2.default)(a.start.dateTime || a.start.date) > (0, _moment2.default)(b.start.dateTime || b.start.date);
          });
          var lastIndex = 0;
          var index = lastIndex - offset_2;

          if (index < 0 || index >= events.length) {
            return {};
          }

          var end = (0, _moment2.default)(events[index].end.dateTime || events[index].end.date);
          var start = (0, _moment2.default)(events[index].start.dateTime || events[index].start.date);
          var range;

          if (format_2 === 'offset' || format_2 === '-offset') {
            range = Math.floor(_moment2.default.duration(end.diff(start)).asSeconds());

            if (format_2 === 'offset') {
              range = -range;
            }

            range = range + 's';
          }

          return [{
            text: range
          }];
        });
      }

      var dateMathQuery = query.match(/^datemath\(([^,]+), *([^,]+)\)/);

      if (dateMathQuery) {
        var expression = dateMathQuery[1];
        var format = dateMathQuery[2];
        var date = dateMath.parse(expression, false);

        if (format === 'offset' || format === '-offset') {
          date = Math.floor(_moment2.default.duration(timeRange.to.diff(date)).asSeconds());

          if (format === 'offset') {
            date = -date;
          }

          date = date + 's';
        } else {
          date = date.format(format);
        }

        return [{
          text: date
        }];
      }

      return Promise.reject(new Error('Invalid query'));
    });
  };

  GoogleCalendarDatasource.prototype.annotationQuery = function (options) {
    var _this = this;

    var annotation = options.annotation;
    var calendarId = annotation.calendarId;

    if (_lodash2.default.isEmpty(calendarId)) {
      return this.q.when([]);
    }

    return this.initialize().then(function () {
      return function () {
        var params = {
          'calendarId': calendarId,
          'timeMin': options.range.from.toISOString(),
          'timeMax': options.range.to.toISOString(),
          'orderBy': 'startTime',
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 250
        };
        return _this.getEvents(params);
      }().then(function (events) {
        var result = _lodash2.default.chain(events).map(function (event) {
          var start = (0, _moment2.default)(event.start.dateTime || event.start.date);
          var end = (0, _moment2.default)(event.end.dateTime || event.end.date);
          return [{
            regionId: event.id,
            annotation: annotation,
            time: start.valueOf(),
            title: event.summary,
            tags: ['Google Calender', event.organizer.displayName],
            text: event.description ? event.description : ""
          }, {
            regionId: event.id,
            annotation: annotation,
            time: end.valueOf(),
            title: event.summary,
            tags: ['Google Calendar', event.organizer.displayName],
            text: event.description ? event.description : ""
          }];
        }).flatten().value();

        return result;
      });
    });
  };

  GoogleCalendarDatasource.prototype.getEvents = function (params) {
    var _this = this;

    return function () {
      if (_this.access != 'proxy') {
        return gapi.client.calendar.events.list(params);
      } else {
        return _this.backendSrv.datasourceRequest({
          url: '/api/tsdb/query',
          method: 'POST',
          data: {
            queries: [_lodash2.default.extend({
              queryType: 'raw',
              api: 'calendar.events.list',
              refId: '',
              datasourceId: _this.id
            }, params)]
          }
        });
      }
    }().then(function (response) {
      return _this.access != 'proxy' ? response.result.items : response.data.results[''].meta.items;
    }).catch(function (err) {
      if (_this.access != 'proxy') {
        throw err;
      } else {
        throw {
          body: JSON.stringify({
            error: {
              message: err.data.results[""].error
            }
          })
        };
      }
    });
  };

  return GoogleCalendarDatasource;
}();

exports.GoogleCalendarDatasource = GoogleCalendarDatasource;

/***/ }),

/***/ "./module.ts":
/*!*******************!*\
  !*** ./module.ts ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnnotationsQueryCtrl = exports.ConfigCtrl = exports.Datasource = undefined;

var _datasource = __webpack_require__(/*! ./datasource */ "./datasource.ts");

var _annotations_query_ctrl = __webpack_require__(/*! ./annotations_query_ctrl */ "./annotations_query_ctrl.ts");

var GoogleCalendarConfigCtrl =
/** @class */
function () {
  function GoogleCalendarConfigCtrl() {}

  GoogleCalendarConfigCtrl.templateUrl = 'partials/config.html';
  return GoogleCalendarConfigCtrl;
}();

exports.Datasource = _datasource.GoogleCalendarDatasource;
exports.ConfigCtrl = GoogleCalendarConfigCtrl;
exports.AnnotationsQueryCtrl = _annotations_query_ctrl.GoogleCalendarAnnotationsQueryCtrl;

/***/ }),

/***/ "grafana/app/core/utils/datemath":
/*!******************************************!*\
  !*** external "app/core/utils/datemath" ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_grafana_app_core_utils_datemath__;

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_lodash__;

/***/ }),

/***/ "moment":
/*!*************************!*\
  !*** external "moment" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_moment__;

/***/ })

/******/ })});;
//# sourceMappingURL=module.js.map