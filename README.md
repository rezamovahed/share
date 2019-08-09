# [MrDemonWolf Share](https://github.com/MrDemonWolf/share-mrdemonwolf-me)

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/MrDemonWolf/share-mrdemonwolf-mer/master/LICENSE)
[![dependencies Status](https://david-dm.org/MrDemonWolf/share-mrdemonwolf-me/status.svg)](https://david-dm.org/MrDemonWolf/share-mrdemonwolf-me)
[![devDependencies Status](https://david-dm.org/MrDemonWolf/share-mrdemonwolf-me/dev-status.svg)](https://david-dm.org/MrDemonWolf/share-mrdemonwolf-me?type=dev)
![GitHub release](https://img.shields.io/github/release/mrdemonwolf/share-mrdemonwolf-me.svg)
![GitHub repo size](https://img.shields.io/github/repo-size/MrDemonWolf/share-mrdemonwolf-me.svg)
[![Follow on twitter](https://img.shields.io/twitter/follow/mrdemonwolf.svg?label=Follow)](https://isitmaintained.com/project/MrDemonWolf/share-mrdemonwolf-me "Follow on twitter")
[![Join Discord](https://discordapp.com/api/guilds/127607669103001600/embed.png)](https://discord.gg/invite/A9x3qEN)

Simple uploader site with sharex support for uploading files,images, and text files.  This is open source and free to use.

This is made by [Nathan Henniges](https://www.github.com/nathanhenniges)

# Download and Setup

You can now download the release [here](https://github.com/MrDemonWolf/share-mrdemonwolf-me/releases/latest/download.zip)

To help with Development or Download of this project you can.
* Clone the repo: `git clone https://github.com/MrDemonWolf/share-mrdemonwolf-me.git`
* [Fork, Clone, or Download on GitHub](https://github.com/MrDemonWolf/share-mrdemonwolf-me)

Please read the setup guide writed [here](SETUP.md)

# Want help develop?
You can use this command to start up with nodemon so you can work on it and test.

```sh
npm run dev-web
```


## Changelog
4.0.0
* Added last login IP
* Added signup IP
<!-- * You can now upload files via your account on the website. -->
* You can now ban and unban users. Comfirm the ban of a user has been added.
* You can also suspend users 24 hours , a week, and even a month. With unsuspend
<!-- *Added API docs markdown -->
* Now you can make yourself the first admin by going to /admin.  If the email matchs the one in the env then it will change the account to admin (This is safe as the email has to be verifyed anyways which makes sure its yours.)
* API has changed file and image route to just be as one.
* Changed createdAt to uploaded in lisings
* Changed share to file in the lisings.
* You can now limit the size of each upload by default its 100M
* Fixed dashboard so it will add a 's' when there is more the one user or upload
* Changed terms on users manger page.  Admin is not role which will display there role either admin or user
* Changed 'Activated' to 'Role' and 'Admin' to 'Status'
* Added Bannned or Suspended and Activate and Unactivated to status.
* Removed last login from both database and user manger.
* Changed text from 'Create user' to 'Create new user' in admin users.
* Fixed the link in the admin nav gallery.  Now it links to the gallery
* Fixed the navbar in admin gallery as it was linking the wrong one.

3.1.0
* Removed File and Text views
* Removed Removed text support due to others being better. (You should use github gists if anything.)

Check out the rest of the change logs [here](/CHANGELOG.md)

## Issues
Have a bug or an issue with this bot? [Open a new issue](https://github.com/MrDemonWolf/share-mrdemonwolf-me/issues) here on GitHub.

## Copyright and License

Copyright 2019 MrDemonWolf. Code released under the [MIT](LICENSE) license.
