---
layout: default
title: Home
nav_order: 1
description: "Simple yet advanced NodeJS, MongoDB and Express based uploader."
permalink: /
---

# What is Share?

Simple yet advanced **NodeJS**, **MongoDB** and **Express** based uploader.  Allows users to upload files,images, and text with moderation tools for admins. Can be used for friends and family or just for you.
{: .fs-6 .fw-300 }

[Get started now](#getting-started){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 } [View it on GitHub](https://github.com/pmarsceill/just-the-docs){: .btn .fs-5 .mb-4 .mb-md-0 }

---

![GitHub release](https://img.shields.io/github/release/mrdemonwolf/share-mrdemonwolf-me.svg?style=for-the-badge)
[![GitHub last commit](https://img.shields.io/github/last-commit/mrdemonwolf/share.svg?logo=git&style=for-the-badge)](https://github.com/mrdemonwolf/share)
[![Trello](https://img.shields.io/badge/Project%20Progress-blue?style=for-the-badge&logo=trello)](https://trello.com/b/uljnYGOg "Follow the project progress here.")
![Travis (.com)](https://img.shields.io/travis/com/mrdemonwolf/share?style=for-the-badge)

## Getting started

### Download
You can now download the release [here](https://github.com/MrDemonWolf/share/releases/download/share.zip)

You can also fork,clone,download from github for pre release builds and development.
* Clone the repo: `git clone https://github.com/MrDemonWolf/share.git`
* [Fork, Clone, or Download on GitHub](/)

### Installation
Before installing, [download and install Node.js](https://nodejs.org/en/download/).

## Edit the .env.example with basic config

```sh
cp .env.example .env
```

Let me explain what which setting in the .env is

| Setting          | Des                                                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------------- |
| COOKIE_SECRET    | Is the cookie secret for express.                                                                                   |
| API_SECRET       | Used for JWT to make sure the tokens are only created from the server it self.                                      |
| DATABASE_URI     | Used to connect to MongoDB Server                                                                                   |
| TITLE            | Is the Website Title.  The format for the title is (page name                                                       | title) |
| FOOTER_TITLE     | Used for the footer.  Can be company name or etc.                                                                   |
| DESC             | Used for SEO desc.                                                                                                  |
| EMAIL            | Please put the admin/owner email.  This is how app converts your user to a admin.                                   |
| SIGNUPS          | Set to false to only allow you to be able to use the app.  If you want public then set to true.                     |
| CREDIT           | Please leave set to true to show your support for the project.  If set to false it will remove the github repo link |
| SENDGRID_API_KEY | This is where you would place a sendgrid API key with permissions for sending. This is needed for sending emails.   |
| EMAIL_DOMAIN     | Domain you will be sending emails from on sendgrid.                                                                 |
| FILE_CHECK       | Its recamend this is true to filter out uploads.  That way bad people can't upload scripts etc.                     |
| NODE_ENV         | Set this to production when you are on prod.                                                                        |
| IP               | IP to run the app on                                                                                                |
| PORT             | Port to run the app on                                                                                              |

Everything here should be set.

## Sendgrid
To setup SENDGRID you would need to create a account [here](https://www.sendgrid.com) if you need help getting a API key its not that hard.  Here's a guide on it. [https://sendgrid.com/docs/ui/account-and-settings/api-keys/](https://sendgrid.com/docs/ui/account-and-settings/api-keys/) .  To stop email from going to spam you may want to setup the domain so they know you own the domain your sending from. [https://sendgrid.com/docs/ui/account-and-settings/how-to-set-up-domain-authentication/](https://sendgrid.com/docs/ui/account-and-settings/how-to-set-up-domain-authentication/)

## Secrets
For COOKIE_SECRET and API_SECRET you can just use a password gen.

## Signups
If your going to use this for personal use.  You want to set SETUPS to false.  As this would disable all signups for emails not matching yours in the env.

## Support
Want to show support for the developer(me) keep CREDIT on true.  But if you don't want to show it then you can set it false.  But please consuider donating to me to help support my projects [paypal](https://paypal.me/demonwolfyt)

## NodeJS and MongoDB
There is already many guides on nodejs and MongoDB so if you want help installing that you can google terms like "How to install NodeJS on Ubuntu" etc depending on your OS.

#### Edit the .env.example with basic config
```sh
cp .env.example .env
```

```sh
nano .env
```

Add what you want to the __.env__.

## Starting the app

#### Install node packages
```sh
npm install
```

#### Start server
To get started with Docker do the following...

```sh
$ cp docker-compose.override.yml.example docker-compose.override.yml
```

Change the values to match your pm2+ public and private key.

```sh
$ docker-compose up
```

Or if you want to run normal

```sh
npm start
```

With *PM2*
```sh
pm2 start process.yml
```
___

### Setup ShareX Config
Here's the sharex config templates for you

[ShareX Config](https://github.com/MrDemonWolf/share-mrdemonwolf-me/blob/master/sharex.sxcu)

Just edit the domain to fit your needs and input into sharex you can read more [here](https://getsharex.com/docs/custom-uploader)
After you done that you will have to get your API key from your account and paste it with Bear ${token} <-- the token

Now what you want to do is go to /admin if the email matchs the one in the *.env* then it will change your user to a admin

<!-- Add other helps in the code base here -->

## Changelog
Check the changelogs [here](/CHANGELOG.md)

## Issues
Have a bug or an issue with this app? [Open a new issue](https://github.com/MrDemonWolf/share-mrdemonwolf-me/issues) here on GitHub.

## Contributing
Want to contribute? Check out our [Code of Conduct]() and [Contributing]() docs. Please check issues [here](https://github.com/MrDemonWolf/share/issues)

## Testing
```bash
$ npm test
```

## License
![GitHub license](https://img.shields.io/github/license/MrDemonWolf/share.svg?style=for-the-badge&logo=github)

## Let's get connected
[![Twitter Follow](https://img.shields.io/twitter/follow/MrDemonWolf.svg?style=for-the-badge&logo=twitter)](https://twitter.com/MrDemonWolf)
[![GitHub followers](https://img.shields.io/github/followers/nathanhenniges.svg?label=Follow&style=for-the-badge&logo=github)](https://github.com/nathanhenniges/)
[![Instagram](https://img.shields.io/static/v1.svg?label=follow&message=@MrDemonWolf&color=grey&logo=instagram&style=for-the-badge&logoColor=white&colorA=critical)](https://www.instagram.com/MrDemonWolf/)
