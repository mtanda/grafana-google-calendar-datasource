export class GoogleCalendarAnnotationsQueryCtrl {

  constructor($scope, $injector) {
    this.scope = $scope;
    var self=this;
    gapi.load('client:auth2', function() {
      gapi.auth2.init({client_id: self.datasource.clientId, scope: self.datasource.scopes});
    });
  }

  handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
  }

  handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
  }
}

GoogleCalendarAnnotationsQueryCtrl.templateUrl = 'partials/annotations.editor.html';
