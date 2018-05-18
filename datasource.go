package main

import (
	"golang.org/x/net/context"

	"github.com/grafana/grafana_plugin_model/go/datasource"
	plugin "github.com/hashicorp/go-plugin"
)

type GoogleCalendarDatasource struct {
	plugin.NetRPCUnsupportedPlugin
}

func init() {
}

func (t *GoogleCalendarDatasource) Query(ctx context.Context, tsdbReq *datasource.DatasourceRequest) (*datasource.DatasourceResponse, error) {
	var response *datasource.DatasourceResponse
	return response, nil
}
