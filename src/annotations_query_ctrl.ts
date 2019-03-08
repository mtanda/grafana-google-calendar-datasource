export class GoogleCalendarAnnotationsQueryCtrl {
  scope: any;
  static templateUrl = 'partials/annotations.editor.html';

  constructor($scope, $injector) {
    this.scope = $scope;
  }
}
