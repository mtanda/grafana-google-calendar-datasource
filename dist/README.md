## Google Calendar (Annotation) Datasource Plugin for Grafana

This plugin provide annotation data of Google Calendar Events.

For each event, start time / end time annotation is displayed.

![](https://raw.githubusercontent.com/mtanda/grafana-google-calendar-datasource/master/dist/images/calendar.png)

### Setup

To use this plugin, you need to get client ID which allow to call Google Calendar API.

Please follow [Quickstart](https://developers.google.com/google-apps/calendar/quickstart/js).

After get the client ID, set the ID to datasource config.

### Options

For each annotation, you need to set calendar ID.

The calendar ID is found at `Calendar settings` page.

![](https://raw.githubusercontent.com/mtanda/grafana-google-calendar-datasource/master/dist/images/annotation_config.png)

------

#### Changelog

##### v1.0.0
- Initial release
- Show start/end event as annotation
