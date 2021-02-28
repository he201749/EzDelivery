FROM node:latest

WORKDIR /home/projet

RUN apt-get update

COPY ../../BackEnd /home/projet

RUN cd /home/projet/BackEnd

RUN npm install

RUN npm run start
