FROM node:8.11.4
MAINTAINER Rodrigo Castilho
ENV NODE_ENV=prod
COPY . /var/www
WORKDIR /var/www
#RUN npm i npm@latest -g
RUN npm install
VOLUME /var/www/img/profile
ENTRYPOINT node cluster.js
EXPOSE 4000