FROM node:lts-buster-slim as base
WORKDIR /usr/src/app

COPY package.json tsconfig.json package-lock.json ./
RUN npm install --no-optional --only-production

COPY src/ ./src/

FROM base as tester
WORKDIR /usr/src/app

COPY jest*.config.js ./
COPY test/ ./test/
RUN npm install --no-optional --only-development
RUN npm run build
RUN npm run test

FROM base as builder
WORKDIR /usr/src/app

RUN npm run build

FROM node:lts-buster-slim as runtime

WORKDIR /usr/src/app
COPY --from=builder --chown=node:node /usr/src/app /usr/src/app
USER node:node

ENTRYPOINT ["node", "./lib/index.js"]
