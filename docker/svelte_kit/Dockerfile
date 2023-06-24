FROM node:18-alpine 

WORKDIR /app

RUN npm install
RUN npm run build

COPY ./build ./build
COPY ./node_modules ./node_modules
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json

EXPOSE 3000

CMD [ "node", "build/index.js" ]