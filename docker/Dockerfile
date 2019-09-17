FROM node:10-alpine as builder

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

COPY package*.json ./
RUN npm ci

FROM node:10-alpine

RUN npm install pm2 nodemon -g

ARG PM2_PUBLIC_KEY
ARG PM2_SECRET_KEY
ENV PM2_PUBLIC_KEY=${PM2_PUBLIC_KEY}
ENV PM2_SECRET_KEY=${PM2_SECRET_KEY}

WORKDIR /usr/src/app

COPY --from=builder node_modules node_modules

COPY . .

CMD ["pm2-runtime", "src/index.js"]