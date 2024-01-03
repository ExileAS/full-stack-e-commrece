FROM node:18

WORKDIR /frontend/src/app

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install

COPY . .

EXPOSE 3000

ENV REACT_APP_BASE_URL=http://localhost:3000

CMD [ "npm", "start" ]