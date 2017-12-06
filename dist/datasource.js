'use strict';

System.register(['lodash', 'moment', './libs/script.js'], function (_export, _context) {
  "use strict";

  var _, moment, scriptjs, _createClass, GoogleCalendarDatasource;

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
        function GoogleCalendarDatasource(instanceSettings, $q, templateSrv) {
          _classCallCheck(this, GoogleCalendarDatasource);

          this.type = instanceSettings.type;
          this.name = instanceSettings.name;
          this.clientId = instanceSettings.jsonData.clientId;
          this.scopes = 'https://www.googleapis.com/auth/calendar.readonly';
          this.discoveryDocs = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
          this.q = $q;
          this.templateSrv = templateSrv;
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
          key: 'annotationQuery',
          value: function annotationQuery(options) {
            var annotation = options.annotation;
            var calendarId = annotation.calendarId;

            if (_.isEmpty(calendarId)) {
              return this.q.when([]);
            }

            return this.initialize().then(function () {
              return gapi.client.calendar.events.list({
                'calendarId': calendarId,
                'timeMin': options.range.from.toISOString(),
                'timeMax': options.range.to.toISOString(),
                'showDeleted': false,
                'singleEvents': true,
                'maxResults': 250,
                'orderBy': 'startTime'
              }).then(function (response) {
                var events = response.result.items;

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
        }]);

        return GoogleCalendarDatasource;
      }());

      _export('GoogleCalendarDatasource', GoogleCalendarDatasource);
    }
  };
});
//# sourceMappingURL=datasource.js.map
