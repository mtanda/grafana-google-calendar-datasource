'use strict';

System.register(['./datasource', './annotations_query_ctrl'], function (_export, _context) {
  "use strict";

  var GoogleCalendarDatasource, GoogleCalendarAnnotationsQueryCtrl, GoogleCalendarConfigCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_datasource) {
      GoogleCalendarDatasource = _datasource.GoogleCalendarDatasource;
    }, function (_annotations_query_ctrl) {
      GoogleCalendarAnnotationsQueryCtrl = _annotations_query_ctrl.GoogleCalendarAnnotationsQueryCtrl;
    }],
    execute: function () {
      _export('ConfigCtrl', GoogleCalendarConfigCtrl = function GoogleCalendarConfigCtrl() {
        _classCallCheck(this, GoogleCalendarConfigCtrl);
      });

      GoogleCalendarConfigCtrl.templateUrl = 'partials/config.html';

      _export('Datasource', GoogleCalendarDatasource);

      _export('ConfigCtrl', GoogleCalendarConfigCtrl);

      _export('AnnotationsQueryCtrl', GoogleCalendarAnnotationsQueryCtrl);
    }
  };
});
//# sourceMappingURL=module.js.map
