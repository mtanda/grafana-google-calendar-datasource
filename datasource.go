package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"

	"golang.org/x/net/context"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	calendar "google.golang.org/api/calendar/v3"

	"github.com/grafana/grafana_plugin_model/go/datasource"
	plugin "github.com/hashicorp/go-plugin"
)

type GoogleCalendarDatasource struct {
	plugin.NetRPCUnsupportedPlugin
}

type EventsListRequest struct {
	CalendarId             string
	TimeMin                string
	TimeMax                string
	OrderBy                string
	Q                      string
	SharedExtendedProperty string
	ShowDeleted            bool
	SingleEvents           bool
	MaxResults             int64
}

func (t *GoogleCalendarDatasource) Query(ctx context.Context, tsdbReq *datasource.DatasourceRequest) (*datasource.DatasourceResponse, error) {
	keyFilePath, ok := tsdbReq.Datasource.DecryptedSecureJsonData["serviceAccountKeyFilePath"]
	if !ok {
		return nil, fmt.Errorf("Unable to get service account key file path")
	}

	keyFileData, err := ioutil.ReadFile(keyFilePath)
	if err != nil {
		return nil, fmt.Errorf("Unable to get service account key: %s", keyFilePath)
	}

	conf, err := google.JWTConfigFromJSON(keyFileData, "https://www.googleapis.com/auth/calendar.readonly")
	if err != nil {
		return nil, fmt.Errorf("Unable to get service account JWT")
	}

	client := conf.Client(oauth2.NoContext)
	client.Get("...")

	calendarService, err := calendar.New(client)
	if err != nil {
		return nil, fmt.Errorf("Unable to retrieve Calendar client: %v", err)
	}

	return t.handleRawQuery(calendarService, tsdbReq)
}

func (t *GoogleCalendarDatasource) handleRawQuery(calendarService *calendar.Service, tsdbReq *datasource.DatasourceRequest) (*datasource.DatasourceResponse, error) {
	response := &datasource.DatasourceResponse{}

	var req EventsListRequest
	if err := json.Unmarshal([]byte(tsdbReq.Queries[0].ModelJson), &req); err != nil {
		return nil, err
	}

	eventsListCall := calendarService.Events.List(req.CalendarId).
		TimeMin(req.TimeMin).TimeMax(req.TimeMax).ShowDeleted(req.ShowDeleted).
		SingleEvents(req.SingleEvents).MaxResults(req.MaxResults).OrderBy(req.OrderBy)
	if req.Q != "" {
		eventsListCall = eventsListCall.Q(req.Q)
	}
	if req.SharedExtendedProperty != "" {
		eventsListCall = eventsListCall.SharedExtendedProperty(req.SharedExtendedProperty)
	}
	events, err := eventsListCall.Do()
	if err != nil {
		return nil, fmt.Errorf("Unable to retrieve events: %v", err)
	}

	resultJson, err := json.Marshal(events)
	if err != nil {
		return nil, err
	}

	response.Results = []*datasource.QueryResult{
		&datasource.QueryResult{
			MetaJson: string(resultJson),
		},
	}

	return response, nil
}
