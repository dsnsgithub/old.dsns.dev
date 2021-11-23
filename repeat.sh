#!/bin/bash

DIRECTORY=$(cd `dirname $0` && pwd)
DATE=$(date +'%m-%d-%Y')

while true; do
    node . 2>&1 | tee -a $DIRECTORY/logs/$DATE.log
done