'use strict';

System.register(['lodash', 'moment', './libs/api'], function (_export, _context) {
  "use strict";

  var _, moment, gpai, _createClass, GoogleCalendarDatasource;

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
    }, function (_libsApi) {
      gpai = _libsApi.default;
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
          this.q = $q;
          this.templateSrv = templateSrv;
        }

        _createClass(GoogleCalendarDatasource, [{
          key: 'testDatasource',
          value: function testDatasource() {
            return true;
          }
        }, {
          key: 'annotationQuery',
          value: function annotationQuery(options) {
            var annotation = options.annotation;
            var calendarId = annotation.calendarId;
            var deferred = this.q.defer();

            if (_.isEmpty(calendarId)) {
              return deferred.resolve([]);
            }

            var self = this;
            gapi.load('client:auth2', function () {
              var auth2 = gapi.auth2.init({ client_id: self.clientId, scope: self.scopes });
              auth2.then(function () {
                gapi.client.load('calendar', 'v3', function () {
                  gapi.client.calendar.events.list({
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
                        annotation: annotation,
                        time: start.valueOf(),
                        title: event.summary,
                        tags: ['start'],
                        text: event.summary
                      }, {
                        annotation: annotation,
                        time: end.valueOf(),
                        title: event.summary,
                        tags: ['end'],
                        text: event.summary
                      }];
                    }).flatten().value();

                    deferred.resolve(result);
                  });
                });
              }, function (error) {
                deferred.reject(error);
              });
            });

            return deferred.promise;
          }
        }]);

        return GoogleCalendarDatasource;
      }());

      _export('GoogleCalendarDatasource', GoogleCalendarDatasource);
    }
  };
});
//# sourceMappingURL=datasource.js.map
