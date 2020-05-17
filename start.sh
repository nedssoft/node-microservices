#!/bin/zsh


cd $(pwd)/conference-app && npm install

cd $(pwd)/../service-registry && npm install

cd $(pwd)/../feedback-service && npm install

cd $(pwd)/../speakers-service && npm install

brew services start rabbitmq

cd $(pwd)/../service-registry && npm start & \
cd $(pwd)/../feedback-service && npm start & \ 
cd $(pwd)/../speakers-service && npm start & \
cd $(pwd)/../conference-app && npm start




