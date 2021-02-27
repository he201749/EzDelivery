FROM node:latest

WORKDIR /home/projet

RUN apt-get update

RUN mkdir /home/clone

RUN cd /home/clone && git clone https://github.com/he201749/EzDelivery.git

RUN cp /home/clone/EzDelivery/BackEnd/* /home/projet -r

RUN npm install pm2 -g

