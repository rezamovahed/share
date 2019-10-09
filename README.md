# [MrDemonWolf Share](/)

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/MrDemonWolf/share-mrdemonwolf-mer/master/LICENSE)
![GitHub release](https://img.shields.io/github/release/mrdemonwolf/share-mrdemonwolf-me.svg)
[![Follow on twitter](https://img.shields.io/twitter/follow/mrdemonwolf.svg?label=Follow)](https://www.twitter.com/mrdemonwolf "Follow on twitter")
[![Trello](https://img.shields.io/badge/Project%20Progress-blue?style=flat-square&logo=trello)](https://trello.com/b/uljnYGOg "Follow the project progress here.")
[![Join Discord](https://discordapp.com/api/guilds/127607669103001600/embed.png)](https://discord.gg/invite/A9x3qEN)

Simple uploader site with sharex support for uploading files,images, and text files.  This is open source and free to use.

This is made by [Nathan Henniges](https://www.github.com/nathanhenniges)

# Download

You can now download the release [here](https://github.com/MrDemonWolf/share-mrdemonwolf-me/releases/latest)

You can also fork,clone,download from github for pre release builds and development.
* Clone the repo: `git clone https://github.com/MrDemonWolf/share-mrdemonwolf-me.git`
* [Fork, Clone, or Download on GitHub](https://github.com/MrDemonWolf/share-mrdemonwolf-me)

## Setup
If your a normal user then please read the setup guide here.

If you want to help out development read this here.

# Changelog
4.0.0 (Unrelased _Oct 31, 2019_)
<!-- * Made a lot of the code cleaner and easier to mange for developers -->
<!-- * You can now upload files via your account on the website. -->
<!-- *Added API docs markdown -->
* Integrated Docker both for development and production modes.  Thanks to @exia for adding this.
* Adding a better way to hannel the emails.  As there is so many templates that are just reused.  So why not make it a export.  For easier reuse.
* Added last password change IP and time.
* Added last activity time.
* Added last login time.
* Added signup IP.
* Added Streamer mode.  It will stop leaks for both the user and if they have admin others as well.
* Added ban and unban users. Comfirm the ban of a user has been added.
* Added suspend users 24 hours , a week, and even a month. With unsuspend
* Now you can make yourself the first admin by going to /admin.  If the email matchs the one in the env then it will change the account to admin (This is safe as the email has to be verifyed anyways which makes sure its yours.)
* API has changed file and image route to just be as one.
* Changed createdAt to uploaded in lisings
* Changed share to file in the lisings.
* You can now limit the size of each upload by default its 100M
* Fixed dashboard so it will add a 's' when there is more the one user or upload
* Changed terms on users manger page.  Admin is not role which will display there role either admin or user
* Changed 'Activated' to 'Role' and 'Admin' to 'Status'
* Added Bannned or Suspended and Activate and Unactivated to status.
* Removed last login from both database and admin panel.
* Changed text from 'Create user' to 'Create new user' in admin users.
* Fixed the link in the admin nav gallery.  Now it links to the gallery
* Fixed the navbar in admin gallery as it was linking the wrong one.

3.1.2
* Hotfix for createdAt date in the upload.js. Now when  you upload it should show the right date.

3.1.1
* Fixed bug with middleware

3.1.0
* Removed File and Text views
* Removed Removed text support due to others being better. (You should use github gists if anything.)

**Check out the rest of the changelogs [here](/CHANGELOG.md)**

## Issues
Have a bug or an issue with this app? [Open a new issue](https://github.com/MrDemonWolf/share-mrdemonwolf-me/issues) here on GitHub.

## Copyright and License

Copyright 2019 MrDemonWolf. Code released under the [MIT](/LICENSE) license.
