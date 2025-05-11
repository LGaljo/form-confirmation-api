# Base image
FROM node:22-alpine as builder

RUN apk add alpine-sdk

WORKDIR /app

COPY --chown=node:node . .

RUN npm ci

RUN npm run build

RUN rm -rf node_modules && \
  NODE_ENV=production npm ci

FROM node:22-alpine

WORKDIR /app

COPY --from=builder --chown=node:node /app  .

RUN apk update
RUN apk add --no-cache "chromium=~108"

USER node

ARG NODE_ENV=production
ARG HOST=0.0.0.0
#ARG PORT=3100
#ARG API_URL=http://localhost:4500
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

EXPOSE 4500

CMD ["npm", "run", "start:prod"]
