---
layout: default
title: Docker
parent: Start App
nav_order: 2
---

# Running app with Docker

{: .fs-6 .fw-300 }

## Install node packages
```sh
npm install
```

## Start the app in docker
```sh
$ cp docker-compose.override.yml.example docker-compose.override.yml
```

Change the values to match your pm2+ public and private key.

```sh
$ docker-compose up
```
