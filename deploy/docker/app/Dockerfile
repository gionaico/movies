FROM node:12-alpine

WORKDIR /usr/src/app


COPY build .

COPY package*.json ./

RUN yarn install


EXPOSE 80

CMD ["yarn","run", "prod"]

