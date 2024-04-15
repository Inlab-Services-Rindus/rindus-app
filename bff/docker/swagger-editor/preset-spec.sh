#!/bin/sh

MAIN_JS=`find /usr/share/nginx/ -name main.*.js`

sed -i "s|REACT_APP_DEFINITION_URL:|REACT_APP_DEFINITION_FILE:|g" $MAIN_JS
sed -i "s|https://raw.githubusercontent.com/asyncapi/spec/v2.6.0/examples/streetlights-kafka.yml|/static/openapi.yml|g" $MAIN_JS