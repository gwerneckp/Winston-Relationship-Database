FROM node:18-alpine AS build

COPY . .
WORKDIR /app
RUN npm install
RUN npm run build

FROM node:18-alpine AS production

WORKDIR /app
COPY --from=build /app/package.json /app/package-lock.json ./
RUN npm install --production
COPY --from=build /app/build ./build
EXPOSE 3000
CMD ["node", "build/index.js"]
