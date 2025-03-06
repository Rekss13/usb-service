#!/bin/bash

source /home/avsplay/myenv/bin/activate
BASEDIR=$(dirname $(realpath "$0"))
${BASEDIR}/main.py $1
