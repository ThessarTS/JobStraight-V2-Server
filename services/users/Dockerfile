FROM node:18

WORKDIR /server/services/users

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4001

CMD [ "npm", "start" ]