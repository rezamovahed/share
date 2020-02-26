---
layout: default
title: NodeJS
parent: Start App
nav_order: 1
---

# Running app with NodeJS

{: .fs-6 .fw-300 }


## Install node packages
```sh
npm install
```

## Start the app

NodeJS

```sh
npm start
```

PM2 (Must have PM2 installed globaly to use.)
To install PM2 globally do

```sh
sudo npm i -g pm2
```

Then you can run (this will run the predefined PM2 config in the app folder.)

```sh
pm2 start
```
