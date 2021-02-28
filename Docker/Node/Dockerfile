FROM node:latest

RUN apt-get update

RUN mkdir launch

RUN git clone https://github.com/he201749/EzDelivery.git 

RUN cp EzDelivery/BackEnd/* /launch -r

RUN cd launch

RUN npm run start


