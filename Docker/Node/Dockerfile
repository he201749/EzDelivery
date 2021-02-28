FROM node:latest

RUN apt-get update

COPY ../../BackEnd /

RUN cd /BackEnd

RUN npm install

RUN npm run start
