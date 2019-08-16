# Changelog
4.0.0
<!-- * Changed the routes of the app for certain actions like account verify and password resets -->
<!-- * Made a lot of the code cleaner and easier to mange for developers -->
* Changed to use cookies for the csurf
* Adding a better way to hannel the emails.  As there is so many templates that are just reused.  So why not make it a export. For easier  reuse.
* Added last password change IP and time.
* Added last activity time.
* Added last login time.
* Added signup IP.
* Streamer mode has been added in the users settings.  It will stop leaks for both the user and if they have admin others as well.
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
