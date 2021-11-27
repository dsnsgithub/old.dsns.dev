#!/bin/bash

DIRECTORY=$(cd `dirname $0` && pwd)

while true; do
    node . 2>&1 | tee -a $DIRECTORY/logs/server.log
done