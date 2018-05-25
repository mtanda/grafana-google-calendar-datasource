'use strict';

System.register(['lodash', 'moment', 'app/core/utils/datemath', './libs/script.js'], function (_export, _context) {
  "use strict";

  var _, moment, dateMath, scriptjs, _createClass, GoogleCalendarDatasource;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_lodash) {
      _ = _lodash.default;
    }, function (_moment) {
      moment = _moment.default;
    }, function (_appCoreUtilsDatemath) {
      dateMath = _appCoreUtilsDatemath;
    }, function (_libsScriptJs) {
      scriptjs = _libsScriptJs.default;
    }],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _export('GoogleCalendarDatasource', GoogleCalendarDatasource = function () {
        function GoogleCalendarDatasource(instanceSettings, $q, templateSrv, timeSrv, backendSrv) {
          _classCallCheck(this, GoogleCalendarDatasource);

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

        _createClass(GoogleCalendarDatasource, [{
          key: 'load',
          value: function load() {
            var deferred = this.q.defer();
            scriptjs('https://apis.google.com/js/api.js', function () {
              gapi.load('client:auth2', function () {
                return deferred.resolve();
              });
            });
            return deferred.promise;
          }
        }, {
          key: 'testDatasource',
          value: function testDatasource() {
            return this.initialize().then(function () {
              return { status: 'success', message: 'Data source is working', title: 'Success' };
            }).catch(function (err) {
              console.log(err);
              return { status: "error", message: err.message, title: "Error" };
            });
          }
        }, {
          key: 'initialize',
          value: function initialize() {
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
                  throw { message: 'failed to initialize' };
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
                throw { message: 'failed to initialize' };
              });
            });
          }
        }, {
          key: 'metricFindQuery',
          value: function metricFindQuery(query) {
            var _this2 = this;

            return this.initialize().then(function () {
              var timeRange = _this2.timeSrv.timeRange();
              var eventsQuery = query.match(/^events\((([^,]+), *)?([^,]+), *([^,]+)\)/);
              if (eventsQuery) {
                var calendarId = eventsQuery[2];
                var fieldPath = eventsQuery[3];
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
                return _this2.getEvents(params).then(function (events) {
                  return _this2.q.when(events.map(function (event) {
                    return { text: _.get(event, fieldPath) };
                  }));
                });
              }

              var startEndQuery = query.match(/^(start|end)\((([^,]+), *)?([^,]+), *([^,]+), *([^,]+)\)/);
              if (startEndQuery) {
                var key = startEndQuery[1] === 'start' ? 'start' : 'end';
                var _calendarId = startEndQuery[3];
                var format = startEndQuery[4];
                var offset = parseInt(startEndQuery[5], 10);
                var _filter = startEndQuery[6];
                var _params = {
                  'calendarId': _calendarId,
                  'timeMin': timeRange.from.toISOString(),
                  'timeMax': timeRange.to.toISOString(),
                  'orderBy': 'startTime',
                  'q': _filter,
                  'showDeleted': false,
                  'singleEvents': true,
                  'maxResults': 250
                };
                return _this2.getEvents(_params).then(function (events) {
                  events.sort(function (a, b) {
                    return moment(a.start.dateTime || a.start.date) > moment(b.start.dateTime || b.start.date);
                  });
                  var lastIndex = 0;
                  var index = lastIndex - offset;
                  if (index < 0 || index >= events.length) {
                    return {};
                  }
                  var date = moment(events[index][key].dateTime || events[index][key].date);
                  if (format === 'offset' || format === '-offset') {
                    date = Math.floor(moment.duration(timeRange.to.diff(date)).asSeconds());
                    if (format === 'offset') {
                      date = -date;
                    }
                    date = date + 's';
                  } else {
                    date = date.format(format);
                  }
                  return [{ text: date }];
                });
              }

              var rangeQuery = query.match(/^range\((([^,]+), *)?([^,]+), *([^,]+), *([^,]+)\)/);
              if (rangeQuery) {
                var _calendarId2 = rangeQuery[2];
                var _format = rangeQuery[3];
                var _offset = parseInt(rangeQuery[4], 10);
                var _filter2 = rangeQuery[5];
                var _params2 = {
                  'calendarId': _calendarId2,
                  'timeMin': timeRange.from.toISOString(),
                  'timeMax': timeRange.to.toISOString(),
                  'orderBy': 'startTime',
                  'q': _filter2,
                  'showDeleted': false,
                  'singleEvents': true,
                  'maxResults': 250
                };
                return _this2.getEvents(_params2).then(function (events) {
                  events.sort(function (a, b) {
                    return moment(a.start.dateTime || a.start.date) > moment(b.start.dateTime || b.start.date);
                  });
                  var lastIndex = 0;
                  var index = lastIndex - _offset;
                  if (index < 0 || index >= events.length) {
                    return {};
                  }
                  var end = moment(events[index].end.dateTime || events[index].end.date);
                  var start = moment(events[index].start.dateTime || events[index].start.date);
                  var range = '';
                  if (_format === 'offset' || _format === '-offset') {
                    range = Math.floor(moment.duration(end.diff(start)).asSeconds());
                    if (_format === 'offset') {
                      range = -range;
                    }
                    range = range + 's';
                  }
                  return [{ text: range }];
                });
              }

              var dateMathQuery = query.match(/^datemath\(([^,]+), *([^,]+)\)/);
              if (dateMathQuery) {
                var expression = dateMathQuery[1];
                var _format2 = dateMathQuery[2];
                var date = dateMath.parse(expression, false);
                if (_format2 === 'offset' || _format2 === '-offset') {
                  date = Math.floor(moment.duration(timeRange.to.diff(date)).asSeconds());
                  if (_format2 === 'offset') {
                    date = -date;
                  }
                  date = date + 's';
                } else {
                  date = date.format(_format2);
                }
                return [{ text: date }];
              }

              return Promise.reject(new Error('Invalid query'));
            });
          }
        }, {
          key: 'annotationQuery',
          value: function annotationQuery(options) {
            var _this3 = this;

            var annotation = options.annotation;
            var calendarId = annotation.calendarId;

            if (_.isEmpty(calendarId)) {
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
                return _this3.getEvents(params);
              }().then(function (events) {
                var result = _.chain(events).map(function (event) {
                  var start = moment(event.start.dateTime || event.start.date);
                  var end = moment(event.end.dateTime || event.end.date);

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
          }
        }, {
          key: 'getEvents',
          value: function getEvents(params) {
            var _this4 = this;

            return function () {
              if (_this4.access != 'proxy') {
                return gapi.client.calendar.events.list(params);
              } else {
                return _this4.backendSrv.datasourceRequest({
                  url: '/api/tsdb/query',
                  method: 'POST',
                  data: {
                    queries: [_.extend({
                      queryType: 'raw',
                      api: 'calendar.events.list',
                      refId: '',
                      datasourceId: _this4.id
                    }, params)]
                  }
                });
              }
            }().then(function (response) {
              return _this4.access != 'proxy' ? response.result.items : response.data.results[''].meta.items;
            }).catch(function (err) {
              if (_this4.access != 'proxy') {
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
          }
        }]);

        return GoogleCalendarDatasource;
      }());

      _export('GoogleCalendarDatasource', GoogleCalendarDatasource);
    }
  };
});
//# sourceMappingURL=datasource.js.map
