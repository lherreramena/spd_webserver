#!/bin/bash

set -x
set -e

#node index.js
#yarn start

npm install -g pm2
pm2 start index.js --name sportdisplay
pm2 save
pm2 startup
