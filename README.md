## Google Calendar (Annotation) Datasource Plugin for Grafana

This plugin provide annotation data of Google Calendar Events.

For each event, start time / end time annotation is displayed.

![](https://raw.githubusercontent.com/mtanda/grafana-google-calendar-datasource/master/dist/images/calendar.png)

### Setup

To use this plugin, you need to get Client ID and OAuth 2.0 credentials which allow to call Google Calendar API
by JavaScript.

Please follow [Quickstart Step 1](https://developers.google.com/google-apps/calendar/quickstart/js) to enable
Google Calendar API and create new web application project. Copy the Client ID into the datasource config.

Next add [Authorized Domain](https://support.google.com/cloud/answer/6158849?hl=en#authorized-domains) for 
OAuth 2.0 under [Google Developer Console](https://console.developers.google.com/project) > 
APIs & Services > OAuth consent screen.

Finally put Grafana path into [Authorized JavaScript Origins](https://support.google.com/cloud/answer/6158849?hl=en#web-applications)
under Google Developer Console > Credentials > [your project name] > Authorized JavaScript Origins.

### Options

For each annotation, you need to set calendar ID.

The calendar ID is found at `Calendar settings` page.

![](https://raw.githubusercontent.com/mtanda/grafana-google-calendar-datasource/master/dist/images/annotation_config.png)

At first time, you need to accept to open this popup window, and accept to use API.

![](https://cloud.githubusercontent.com/assets/224552/23993102/a0580e2e-0a82-11e7-8e43-8e47973e2a97.png)

### Templating

#### Query variable

Name | Description
---- | --------
*events(calendar_id, field_path, filter)* | Returns a list of field value matching the `filter`.
*start(calendar_id, format, offset, filter)* | Returns a list of start timestamp matching the `filter` and offset.
*end(calendar_id, format, offset, filter)* | Returns a list of end timestamp matching the `filter` and offset.
*range(calendar_id, format, offset, filter)* | Returns a list of range for the event matching the `filter` and offset.
------

#### Changelog

##### v1.0.0
- Initial release
- Show start/end event as annotation
