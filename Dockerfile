FROM node:10

WORKDIR /microservice

COPY ./app/package.json        /microservice
COPY ./app/index.js            /microservice
COPY ./app/app.js              /microservice
COPY ./app/veraz.controller.js /microservice
COPY ./app/veraz.route.js      /microservice
COPY ./app/veraz.model.js      /microservice

ENV PORT = 3003
EXPOSE 3003

RUN npm install
CMD node index.js