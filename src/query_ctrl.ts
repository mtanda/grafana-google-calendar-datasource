import { QueryCtrl } from 'grafana/app/plugins/sdk';

export class GoogleCalendarQueryCtrl extends QueryCtrl {
  scope: any;
  panelCtrl: any;
  static templateUrl = 'query.editor.html';

  /** @ngInject */
  constructor($scope, $injector) {
    super($scope, $injector);
    this.scope = $scope;
  }

  onChangeInternal() {
    this.panelCtrl.refresh();
  }
}
