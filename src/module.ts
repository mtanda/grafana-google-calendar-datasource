import { GoogleCalendarDatasource } from './datasource';
import { GoogleCalendarAnnotationsQueryCtrl } from './annotations_query_ctrl';

class GoogleCalendarConfigCtrl {
  static templateUrl = 'partials/config.html';
}

export {
  GoogleCalendarDatasource as Datasource,
  GoogleCalendarConfigCtrl as ConfigCtrl,
  GoogleCalendarAnnotationsQueryCtrl as AnnotationsQueryCtrl
};
