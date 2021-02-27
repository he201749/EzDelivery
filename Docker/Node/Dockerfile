FROM node:latest

RUN apt-get update

RUN mkdir /home/clone

RUN cd /home/clone && git clone https://github.com/he201749/EzDelivery.git

RUN npm install pm2 -g

RUN cd /home/clone/EzDelivery/BackEnd

RUN npm install

RUN npm run start