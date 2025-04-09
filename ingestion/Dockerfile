# ingestion/Dockerfile
FROM node:22.14.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN chmod +x run.sh

EXPOSE 4002

CMD [ "sh", "run.sh" ]
