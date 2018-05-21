import _ from 'lodash';
import moment from 'moment';
import scriptjs from './libs/script.js';

export class GoogleCalendarDatasource {

  constructor(instanceSettings, $q, templateSrv, backendSrv) {
    this.type = instanceSettings.type;
    this.name = instanceSettings.name;
    this.id = instanceSettings.id;
    this.access = instanceSettings.jsonData.access || 'direct';
    this.clientId = instanceSettings.jsonData.clientId;
    this.scopes = 'https://www.googleapis.com/auth/calendar.readonly';
    this.discoveryDocs = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
    this.q = $q;
    this.templateSrv = templateSrv;
    this.backendSrv = backendSrv;
    this.initialized = false;
  }

  load() {
    let deferred = this.q.defer();
    scriptjs('https://apis.google.com/js/api.js', () => {
      gapi.load('client:auth2', () => {
        return deferred.resolve();
      });
    });
    return deferred.promise;
  }

  testDatasource() {
    return this.initialize().then(() => {
      return { status: 'success', message: 'Data source is working', title: 'Success' };
    }).catch(err => {
      console.log(err);
      return { status: "error", message: err.message, title: "Error" };
    });
  }

  initialize() {
    if (this.access == 'proxy') {
      return Promise.resolve([]);
    }
    if (this.initialized) {
      return Promise.resolve(gapi.auth2.getAuthInstance().currentUser.get());
    }

    return this.load().then(() => {
      return gapi.client.init({
        clientId: this.clientId,
        scope: this.scopes,
        discoveryDocs: this.discoveryDocs
      }).then(() => {
        let authInstance = gapi.auth2.getAuthInstance();
        if (!authInstance) {
          throw { message: 'failed to initialize' };
        }
        let isSignedIn = authInstance.isSignedIn.get();
        if (isSignedIn) {
          this.initialized = true;
          return authInstance.currentUser.get();
        }
        return authInstance.signIn().then(user => {
          this.initialized = true;
          return user;
        });
      }, err => {
        console.log(err);
        throw { message: 'failed to initialize' };
      });
    });
  }

  annotationQuery(options) {
    var annotation = options.annotation;
    var calendarId = annotation.calendarId;

    if (_.isEmpty(calendarId)) {
      return this.q.when([]);
    }

    return this.initialize().then(() => {
      return (() => {
        let params = {
          'calendarId': calendarId,
          'timeMin': options.range.from.toISOString(),
          'timeMax': options.range.to.toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 250,
          'orderBy': 'startTime'
        };
        if (this.access != 'proxy') {
          return gapi.client.calendar.events.list(params);
        } else {
          return this.backendSrv.datasourceRequest({
            url: '/api/tsdb/query',
            method: 'POST',
            data: {
              queries: [
                _.extend({
                  queryType: 'raw',
                  api: 'calendar.events.list',
                  refId: '',
                  datasourceId: this.id
                }, params)
              ]
            }
          });
        }
      })().then((response) => {
        var events = this.access != 'proxy' ? response.result.items : response.data.results[''].meta.items;

        var result = _.chain(events)
          .map((event) => {
            var start = moment(event.start.dateTime || event.start.date);
            var end = moment(event.end.dateTime || event.end.date);

            return [
              {
                regionId: event.id,
                annotation: annotation,
                time: start.valueOf(),
                title: event.summary,
                tags: ['Google Calender', event.organizer.displayName],
                text: event.description ? event.description : "",
              },
              {
                regionId: event.id,
                annotation: annotation,
                time: end.valueOf(),
                title: event.summary,
                tags: ['Google Calendar', event.organizer.displayName],
                text: event.description ? event.description : "",
              }
            ];
          }).flatten().value();

        return result;
      });
    });
  }
}
