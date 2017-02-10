import _ from 'lodash';
import moment from 'moment';
import gpai from './libs/api';

export class GoogleCalendarDatasource {

  constructor(instanceSettings, $q, templateSrv) {
    this.type = instanceSettings.type;
    this.name = instanceSettings.name;
    this.clientId = instanceSettings.jsonData.clientId;
    this.scopes = 'https://www.googleapis.com/auth/calendar.readonly';
    this.q = $q;
    this.templateSrv = templateSrv;
  }

  testDatasource() {
    return true;
  }

  annotationQuery(options) {
    var annotation = options.annotation;
    var calendarId = annotation.calendarId;
    var deferred = this.q.defer();

    if (_.isEmpty(calendarId)) {
      return deferred.resolve([]);
    }

    var self = this;
    gapi.load('client:auth2', function() {
      var auth2 = gapi.auth2.init({client_id: self.clientId, scope: self.scopes});
      auth2.then(function () {
        gapi.client.load('calendar', 'v3', function() {
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

            var result = _.chain(events)
              .map(function (event) {
                var start = moment(event.start.dateTime || event.start.date);
                var end = moment(event.end.dateTime || event.end.date);

                return [
                  {
                    annotation: annotation,
                    time: start.valueOf(),
                    title: event.summary,
                    tags: ['start'],
                    text: event.summary
                  },
                  {
                    annotation: annotation,
                    time: end.valueOf(),
                    title: event.summary,
                    tags: ['end'],
                    text: event.summary
                  }
                ];
              }).flatten().value();

            deferred.resolve(result);
          });
        });
      }, function(error) {
        deferred.reject(error);
      });
    });

    return deferred.promise;
  }
}
