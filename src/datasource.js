import _ from 'lodash';
import moment from 'moment';
import scriptjs from './libs/script.js';

export class GoogleCalendarDatasource {

  constructor(instanceSettings, $q, templateSrv, backendSrv) {
    this.type = instanceSettings.type;
    this.name = instanceSettings.name;
    this.clientId = instanceSettings.jsonData.clientId;
    this.iss = instanceSettings.jsonData.iss;
    this.privateKeyId = instanceSettings.jsonData.privateKeyId;
    this.privateKey = instanceSettings.jsonData.privateKey;
    this.expireDate = null;
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

  createJWT(header, claims) {
    let asciiToUint8array = (s) => {
      let buf = new Uint8Array(s.length);
      for (let i = 0; i < s.length; i++) {
        buf[i] = s.charCodeAt(i);
      }
      return buf;
    };

    let hexToUint8array = (hexString) => {
      if (hexString.length % 2 != 0) {
        throw 'Invalid hexString';
      }

      let buf = new Uint8Array(hexString.length / 2);
      for (let i = 0; i < hexString.length; i += 2) {
        let byteValue = parseInt(hexString.substr(i, 2), 16);
        if (byteValue == NaN) {
          throw 'Invalid hexString';
        }
        buf[i / 2] = byteValue;
      }
      return buf;
    };

    // generate key
    // jq -r .private_key key.json | grep -v '^$' > pkey
    // openssl pkcs8 -topk8 -nocrypt -in pkey -outform DER -out der
    // xxd -p der
    const stripped = this.privateKey.split("\n").join('');
    let pkey = hexToUint8array(stripped);

    return window.crypto.subtle.importKey(
      'pkcs8', pkey,
      { name: 'RSASSA-PKCS1-v1_5', hash: { name: 'SHA-256' }, },
      false, ['sign']
    ).then(importedKey => {
      const encodedHeader = window.btoa(JSON.stringify(header));
      const encodedClaims = window.btoa(JSON.stringify(claims));
      const data = encodedHeader + '.' + encodedClaims;
      return window.crypto.subtle.sign({ name: 'RSASSA-PKCS1-v1_5' }, importedKey, asciiToUint8array(data)).then(signature => {
        signature = window.btoa(String.fromCharCode(...new Uint8Array(signature)));
        return [encodedHeader, encodedClaims, signature].join('.');
      })
    });
  }

  getAccessTokenForServiceAccount() {
    let now = Math.floor(new Date().getTime() / 1000);
    let header = {
      alg: 'RS256',
      typ: 'JWT',
      kid: this.privateKeyId,
    };
    let claims = {
      iss: this.iss,
      sub: this.iss,
      scope: 'https://www.googleapis.com/auth/calendar.readonly',
      aud: 'https://www.googleapis.com/oauth2/v4/token',
      iat: now,
      exp: now + 3600
    };
    return this.createJWT(header, claims).then(assertion => {
      let body = {
        assertion: assertion,
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer'
      };
      let options = {
        url: 'https://www.googleapis.com/oauth2/v4/token',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      };
      options.transformRequest = data => {
        return $.param(data);
      };
      options.data = body;

      return this.backendSrv.datasourceRequest(options).then(response => {
        return response.data;
      });
    });
  }

  testDatasource() {
    return this.initialize().then(() => {
      return { status: 'success', message: 'Data source is working', title: 'Success' };
    }).catch(err => {
      console.log(err);
      return { status: "error", message: err.message, title: "Error" };
    });
  }

  isExpired() {
    return this.expireDate && moment().isAfter(this.expireDate);
  }

  initialize() {
    if (this.initialized && !this.isExpired()) {
      return Promise.resolve(gapi.auth2.getAuthInstance().currentUser.get());
    }

    return this.load().then(() => {
      if (this.clientId) {
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
      } else {
        return this.getAccessTokenForServiceAccount().then(data => {
          this.expireDate = moment().add(data.expires_in, 's');
          return gapi.client.init({
            clientId: this.iss,
            apiKey: data.access_token,
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
          });
        }, err => {
          console.log(err);
          throw { message: 'failed to initialize' };
        });
      }
    });
  }

  annotationQuery(options) {
    var annotation = options.annotation;
    var calendarId = annotation.calendarId;

    if (_.isEmpty(calendarId)) {
      return this.q.when([]);
    }

    return this.initialize().then(() => {
      return gapi.client.calendar.events.list({
        'calendarId': calendarId,
        'timeMin': options.range.from.toISOString(),
        'timeMax': options.range.to.toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 250,
        'orderBy': 'startTime'
      }).then((response) => {
        var events = response.result.items;

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
