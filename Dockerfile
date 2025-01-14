FROM node:21-alpine

WORKDIR /app

COPY package.json /app/

RUN npm install

COPY . /app/

RUN npm run build

CMD npm run serve