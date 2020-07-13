FROM node:lts-buster-slim as builder
WORKDIR /usr/src/app

COPY package.json tsconfig.json package-lock.json ./
COPY src/ ./src/
RUN npm install --no-optional
RUN npm run build

FROM node:lts-buster-slim as runtime

WORKDIR /usr/src/app
COPY --from=builder --chown=node:node /usr/src/app /usr/src/app
USER node:node

ENTRYPOINT ["node", "./lib/index.js"]
