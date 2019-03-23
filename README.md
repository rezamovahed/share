# [DemonWolfDev Community Bot Server](https://github.com/DemonWolfDev/community-bot-server)

## Status

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/DemonWolfDev/community-bot-serverr/master/LICENSE)
[![dependencies Status](https://david-dm.org/DemonWolfDev/community-bot-server/status.svg)](https://david-dm.org/DemonWolfDev/community-bot-server)
[![devDependencies Status](https://david-dm.org/DemonWolfDev/community-bot-server/dev-status.svg)](https://david-dm.org/DemonWolfDev/community-bot-server?type=dev)

## Description
This is the [DemonWolfDev](https://www.demonwolfdev.com) Offical comunnity bot which manges the community for MrDemonWolf (Founder)

This was meant to help him out and be able to ofter more the community as a whole

This is the server of the bot which is meant to be run on a server in the cloud but like anything can be run localy as you can just run the command.  And then set the env api URL to localhost:port.

[Nathan Henniges](https://www.github.com/nathanhenniges) made this bot 100% open source and is licensed under MIT so others may use it and also help out with programming. Feel free to fork.

## Download and Installation

To begin using this template, choose one of the following options to get started:
* Clone the repo: `git clone https://github.com/DemonWolfDev/community-bot-server.git`
* [Fork, Clone, or Download on GitHub](https://github.com/DemonWolfDev/community-bot-server)

### Basic Usage
#### Edit the .env.example with basic config
```sh
cp .env.example .env
```
```sh
nano .env
```
#### Install node packages
```sh
npm install
```

#### Start bot
```sh
npm run bot
```
#### Start data (Note this must be run for some functions to work.  This is a service to grab data from twitch and other services to cache in the database.)
```sh
npm run data
```
#### Start the API (This must be running for the [client](https://www.github.com/demonwolfdev/community-bot-client))
```sh
npm run api
```

#### Start web server
```sh
npm run web
```

If you want to start everything at once you can do

You will need PM2 installed to use the 2nd command.
```sh
npm install -g pm2
```
```sh
pm2 start process.yml
```
### Want help develop the community bot server?
You can use this command to start up with nodemon so you can work on it and test.

```sh
npm run dev-bot
```
```sh
npm run dev-data
```
```sh
npm run dev-web
```
```sh
npm run dev-api
```

### Issues
Have a bug or an issue with this bot? [Open a new issue](https://github.com/DemonWolfDev/community-bot-server/issues) here on GitHub.

## Copyright and License

Copyright 2019 DemonWolfDev. Code released under the [MIT](https://github.com/DemonWolfDev/community-bot-server/blob/master/LICENSE) license.
