---
layout: default
title: Configuration
nav_order: 2
---

# Configuration
{: .no_toc }


All of Shares configuration is saved in the .env and the database as well.
{: .fs-6 .fw-300 }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---


View [.env.example](https://github.com/MrDemonWolf/share/blob/master/.env.example) file as an example.

## Session Secret

```yaml
# Set signing key cookie based sessions.
# This is to ensure the cookies are created from this app.
SESSION_SECRET=HKfUWFCeRdAaIhqHL6aQ6aX1
```

## JWT Secret

```yaml
# Set signing key for JWT (jsonwebtokens)
# Which is used for making sure the API tokens are created from this app it self and they can't be modifyed.
JWT_SECRET=HKfUWFCeRdAaIhqHL6aQ6aX1
```
