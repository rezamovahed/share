# How to Setup
## Edit the .env.example with basic config

```sh
cp .env.example .env
```

Let me explain what which setting in the .env is

| Setting  | Des |
| ------------- | ------------- |
| COOKIE_SECRET  | Is the cookie secret for express.  |
| API_SECRET  | Used for JWT to make sure the tokens are only created from the server it self.  |
| DATABASE_URI  | Used to connect to MongoDB Server  |
| TITLE  | Is the Website Title.  The format for the title is (page name | title)  |
| FOOTER_TITLE  | Used for the footer.  Can be company name or etc.  |
| DESC  | Used for SEO desc.  |
| EMAIL  | Please put the admin/owner email.  This is how app converts your user to a admin.  |
| SIGNUPS  | Set to false to only allow you to be able to use the app.  If you want public then set to true.  |
| CREDIT  | Please leave set to true to show your support for the project.  If set to false it will remove the github repo link  |
| SENDGRID_API_KEY  | This is where you would place a sendgrid API key with permissions for sending. This is needed for sending emails. |
| EMAIL_DOMAIN  | Domain you will be sending emails from on sendgrid. |
| FILE_CHECK  | Its recamend this is true to filter out uploads.  That way bad people can't upload scripts etc. |
| NODE_ENV  | Set this to production when you are on prod. |
| IP  | IP to run the app on |
| PORT  | Port to run the app on |

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

## Setup for install
You have to edit the .env with the new vaules then run

```sh
$ npm run installer
```

This will give you a *ONE Time password* used to verify its you.  Enter this on the website and it will take you to create the first admin account and setup some basic settings.

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

## Want help develop?
You can use this command to start up with nodemon so you can work on it and test.

```sh
npm run dev-web
```

To get started with Docker do the following...

```sh
$ cp docker-compose.override.yml.example docker-compose.override.yml
```

Change the values to match your pm2+ public and private key.

```sh
$ docker-compose up
```

___

### Setup ShareX Config
Here's the sharex config templates for you

[ShareX Config](https://github.com/MrDemonWolf/share-mrdemonwolf-me/blob/master/sharex.sxcu)

Just edit the domain to fit your needs and input into sharex you can read more [here](https://getsharex.com/docs/custom-uploader)
After you done that you will have to get your API key from your account and paste it with Bear ${token} <-- the token

Now what you want to do is go to /admin if the email matchs the one in the *.env* then it will change your user to a admin -->
