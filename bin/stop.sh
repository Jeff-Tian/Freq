#!/usr/bin/env bash

APP_NAME="freq"

pm2 stop "$APP_NAME" || echo "$APP_NAME" not exist