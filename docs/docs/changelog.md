---
layout: default
title: Changelog
nav_order: 3
---

# Changelog
4.0.0 (Unrelased _Feb 8, 2020)
__This is a fair big of a update but this is a list "all" changes that have been made__

* Made a lot of the code cleaner and easier to mange for developers
<!-- * You can now upload files via your account on the website. -->
<!-- * Added last password change IP and date. -->
<!-- * Added last activity date.-->
<!-- * Added last login date. -->
* Added a veirfy checkmark.
* Redesigned and redo of the upload,token and user lising pages.
* Added Tests
* Removed avatars
* Added API docs
* Switched to sendgrid offical mailer
* Changed from csurf to lusca
* Changed the routes a little bit.  /me is now / and account is /account
* Changed from passport-local-monngoose to pssword-local.
* Integrated Docker both for development and production modes.  Thanks to @exia for adding this.
* Adding a better way to handle the emails.  As there is so many templates that are just reused.  For easier reuse.
* Added Streamer mode.  It will stop leaks for both the user and if they have admin others as well.
* Now you can make yourself the first admin by going to /admin.  If the email matchs the one in the env then it will change the account to admin (This is safe as the email has to be verifyed anyways which makes sure its yours.)
* API route has been changed file and image route to just be as one.
* Changed createdAt to uploaded in lisings
* Changed share to file in the lisings.
* You can now limit the size of each upload by default its 100M
* Fixed dashboard so it will add a 's' when there is more the one user or upload
* Added Bannned or Suspended and Activate and Unactivated to status.
* Changed 'Activated' to 'Role' and 'Admin' to 'Status'
* Added suspend users 24 hours , a week, and even a month. With unsuspend
* Added ban and unban users. Comfirm the ban of a user has been added.
* Removed last login IP from both database and admin panel.
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

3.0.1
* Added Dec to image and files

3.0.0
* Better Gallery
* Added support for proxy more
* Now the upload link will add https based on the proxy and even the domain of the server
* Fixed login bug with tokens via the proxy trust
* Updated env template
* Added psd, doc, docx, xls, xlsx file support.
* Added better ZIP upload support
* Changed to npm start from npm run web
* Added templates for sharex imput (All you have to do is replace the name and add your API key)
* Added robots.txt.

2.0.0
* Many changes
* Better upload URLs
* View pages for files,images, and text

1.0.0
* First public build.
