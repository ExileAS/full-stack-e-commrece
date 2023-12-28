FROM node:18

WORKDIR /backend/src/app

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install

COPY . .

EXPOSE 8000

CMD [ "node", "server" ]