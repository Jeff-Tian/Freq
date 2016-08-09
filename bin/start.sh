#!/usr/bin/env bash

PORT="3000"
APP_NAME="freq"

if [ -n "$PORT" ]; then
    echo "Listening on port: $PORT"
    export PORT
fi

CURRENT_PATH=`dirname $0`
pm2 start "$CURRENT_PATH/../app.js" --name "$APP_NAME" --harmony

exit $?