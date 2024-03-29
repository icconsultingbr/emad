#FROM node:latest 
#MAINTAINER Rodrigo Castilho
#ENV NODE_ENV=prod 
#COPY . /var/tmp
#WORKDIR /var/tmp
#RUN npm install
#RUN npm install -g @angular/cli --unsafe
#ENTRYPOINT ng serve --env=${NODE_ENV} --host 0.0.0.0 --public 0.0.0.0 --disable-host-check
#EXPOSE 4200

### STAGE 1: Build ### 
# We label our stage as 'builder'

FROM node:8.11.4 as builder
LABEL maintainer="THREEO IT COMPANY"
COPY package.json package-lock.json ./

#RUN npm set progress=false && npm config set depth 0 && npm cache clean --force
## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
#RUN npm i npm@latest -g

RUN npm install && mkdir /ng-app && cp -R ./node_modules ./ng-app
WORKDIR /ng-app
COPY . .
ARG env=prod

## Build the angular app in production mode and store the artifacts in dist folder

RUN $(npm bin)/ng build --prod --build-optimizer --environment=$env --base-href="/e-atende/"

### STAGE 2: Setup ###

FROM nginx:latest

## Copy our default nginx config

COPY nginx/default.conf /etc/nginx/conf.d/

COPY /scripts/startup.sh startup.sh
RUN chmod +x /startup.sh
RUN sed -i -e 's/\r$//' /startup.sh

## Remove default nginx website

RUN rm -rf /usr/share/nginx/html/*

## From 'builder' stage copy over the artifacts in dist folder to default nginx public folder

COPY --from=builder /ng-app/dist /usr/share/nginx/html

CMD [ "/startup.sh" ]