#!/bin/bash

while true; do
    node . 2>&1 | tee -a /logs/express.log
done    