# Base image
FROM node:20-alpine as builder

RUN apk add alpine-sdk

WORKDIR /app

COPY --chown=node:node . .

RUN npm ci

RUN npm run build

RUN rm -rf node_modules && \
  NODE_ENV=production npm ci

FROM node:20-alpine

WORKDIR /app

COPY --from=builder --chown=node:node /app  .

RUN apk add --no-cache chromium

USER node

ARG NODE_ENV=production
ARG HOST=0.0.0.0
#ARG PORT=3100
#ARG API_URL=http://localhost:4500

EXPOSE 4500

CMD ["npm", "run", "start:prod"]
