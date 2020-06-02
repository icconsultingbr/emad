FROM node:8.11.4

LABEL maintainer="THREEO IT COMPANY"

#ENV NODE_ENV=prod

WORKDIR /var/www

# Copy only package.json because image layer caching
ADD package.json /var/www

RUN npm install

COPY . /var/www

VOLUME /var/www/img/profile

ENTRYPOINT ["node"]

CMD ["cluster.js"] 

EXPOSE 4000