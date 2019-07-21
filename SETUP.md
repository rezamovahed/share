## How to Setup
#### Edit the .env.example with basic config

```sh
cp .env.example .env
```

Let me exapind what which setting in the .env is


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

<!--
#### Edit the .env.example with basic config
```sh
cp .env.example .env
```
```sh
nano .env
```
Add what you want to the __.env__.
#### Install node packages
```sh
npm install
```

#### Start server
```sh
npm start
```
### Setup Account and ShareX
And go to your localhost:5050 or yourdomain.com either works and click login then create a account.

You should be be able to if you disable signups as you put your email in the __.env__ .

Once done we move on the next step.

Here's the sharex config templates for you

[ShareX Config](https://github.com/MrDemonWolf/share-mrdemonwolf-me/blob/master/sharex.sxcu)

Just edit the domain to fit your needs and input into sharex you can read more [here](https://getsharex.com/docs/custom-uploader)
After you done that you will have to get your API key from your account and paste it with Bear ${token} <-- the token

Now what you want to do is go to /admin if the email matchs the one in the *.env* then it will change your user to a admin -->
