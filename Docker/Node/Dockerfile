FROM node:latest

WORKDIR /home/projet

RUN apt-get update

RUN mkdir /home/clone

RUN cd /home/clone 

RUN git clone https://github.com/he201749/EzDelivery.git

RUN cp /home/clone/EzDelivery/BackEnd/* /home/projet -r

RUN cd /home/projet

RUN npm install

RUN npm run start
