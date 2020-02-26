---
layout: default
title: Configuration
nav_order: 2
---

# Configuration
{: .no_toc }


All of Share configuration is saved in the .env and the database as well.
{: .fs-6 .fw-300 }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---


View [.env.example](https://github.com/MrDemonWolf/share/blob/master/.env.example) file as an example.

## Site Title

```yaml
# Set the site/app title
# This is used for title on html pages and also for sending of emails
TITLE=Share
```

## Site Description

```yaml
# Set the description of the site/app for SEO
DESC=Advanced uploader with web front-end for images,files,and text. Built with ShareX in mind. Licensed under MIT and is free to use.
```

## Email (First install ONLY)

```yaml
# Set a email to become the first owner/admin.
# This is used to convert the owner to owner role for the first time install.
EMAIL=example@example.com
```

## Footer

```yaml
# Set the footer text
# This is the branding name of who is running the site/app.
FOOTER_TEXT=Share
```

## Footer Link

```yaml
# Set the footer text link
# This is the footer text URL which it should link to.
FOOTER_LINK=Share
```

## Signups

```yaml
# Set if you want other users to be able to signup.
# If you are setting this up just for yourself.  Then keep this false
# But if you want to let anyone signup and use the site/app then set this to true.
# Only supports true or false
SIGNUPS=false
```

## Credit

```yaml
# Choose if you want to support the developer by adding a link back to the github repo.
# Only supports true or false
CREDIT=false
```

## Session Secret

```yaml
# Set signing key cookie based sessions.
# This is to ensure the cookies are created from this app.
SESSION_SECRET=HKfUWFCeRdAaIhqHL6aQ6aX1
```

## JWT Secret

```yaml
# Set signing key for JWT (jsonwebtokens)
# Which is used for making sure the API tokens are created from this app it self and
# they can't be modifyed.
JWT_SECRET=HKfUWFCeRdAaIhqHL6aQ6aX1
```

## Database URIs

```yaml
# Set the database connection URI
# This is where all the user data will be stored. (Only MongoDB is supported)
DATABASE_URI=mongodb://localhost:27017/share
```
