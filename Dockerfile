FROM node:10

WORKDIR /microservice

COPY ./app/package.json        /microservice
COPY ./app/index.js            /microservice
COPY ./app/app.js              /microservice
COPY ./app/veraz.controller.js /microservice
COPY ./app/veraz.route.js      /microservice
COPY ./app/veraz.model.js      /microservice

ENV GATEWAY_PORT = 3000;
ENV GATEWAY_HOST = 'localhost';
ENV TOKEN_PATH = '/validate'
ENV COUNTER_PATH = '/count'
ENV MONGO_URL = 'clustermongodb-1sv33.mongodb.net'
ENV MONGO_DB = 'up_tap'
ENV MONGO_USR = 'up_tap_veraz'
ENV MONGO_PASS = 'QoNCPCuTYSp3uAjC'
ENV PORT = 3003
EXPOSE 3003

RUN npm install
CMD node index.js