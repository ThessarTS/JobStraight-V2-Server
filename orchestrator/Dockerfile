FROM node:18

WORKDIR /server/orchestrator

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4000

CMD [ "npm", "start" ]