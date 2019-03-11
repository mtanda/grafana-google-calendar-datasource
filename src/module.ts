import { GoogleCalendarDatasource } from './datasource';
import { GoogleCalendarQueryCtrl } from './query_ctrl';
import { GoogleCalendarAnnotationsQueryCtrl } from './annotations_query_ctrl';

class GoogleCalendarConfigCtrl {
  static templateUrl = 'partials/config.html';
}

export {
  GoogleCalendarDatasource as Datasource,
  GoogleCalendarConfigCtrl as ConfigCtrl,
  GoogleCalendarQueryCtrl as QueryCtrl,
  GoogleCalendarAnnotationsQueryCtrl as AnnotationsQueryCtrl
};
