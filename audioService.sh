#!/bin/bash

source /home/avsplay/myenv/bin/activate
BASEDIR=`pwd`/$(dirname $0)
${BASEDIR}/main.py $1
