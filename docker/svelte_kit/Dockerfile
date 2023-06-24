FROM node:18-alpine

WORKDIR /app
RUN rm -rf ./*
COPY --from=build /app/package.json .
COPY --from=build /app/build .
RUN npm install --omit=dev

CMD ["node", "index.js"]