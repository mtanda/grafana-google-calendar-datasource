'use strict';

System.register([], function (_export, _context) {
  "use strict";

  var _createClass, GoogleCalendarAnnotationsQueryCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [],
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

      _export('GoogleCalendarAnnotationsQueryCtrl', GoogleCalendarAnnotationsQueryCtrl = function () {
        function GoogleCalendarAnnotationsQueryCtrl($scope, $injector) {
          _classCallCheck(this, GoogleCalendarAnnotationsQueryCtrl);

          this.scope = $scope;
          var self = this;
          gapi.load('client:auth2', function () {
            gapi.auth2.init({ client_id: self.datasource.clientId, scope: self.datasource.scopes });
          });
        }

        _createClass(GoogleCalendarAnnotationsQueryCtrl, [{
          key: 'handleAuthClick',
          value: function handleAuthClick(event) {
            gapi.auth2.getAuthInstance().signIn();
          }
        }, {
          key: 'handleSignoutClick',
          value: function handleSignoutClick(event) {
            gapi.auth2.getAuthInstance().signOut();
          }
        }]);

        return GoogleCalendarAnnotationsQueryCtrl;
      }());

      _export('GoogleCalendarAnnotationsQueryCtrl', GoogleCalendarAnnotationsQueryCtrl);

      GoogleCalendarAnnotationsQueryCtrl.templateUrl = 'partials/annotations.editor.html';
    }
  };
});
//# sourceMappingURL=annotations_query_ctrl.js.map
