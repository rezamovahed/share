---
title: Upload
description: Simple yet advanced NodeJS, MongoDB and Express based uploader.
position: 5
category: API
---

## Get Uploads

Allows a logged in user to get all of their current uploads

#### Path

`GET /upload`

#### Headers

| Field         | Type   | Description       |
| :------------ | :----- | :---------------- |
| Authorization | string | JWT access token. |

#### Example

<code-group>
  <code-block label="Request" active>

```sh
curl --location --request GET 'https://www.example.com/api/upload' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZjRiZmYxMjEwMzdlNDI0YTE3YTNlYmMiLCJpYXQiOjE1OTkyNDE1OTMsImV4cCI6MTU5OTI0MzM5M30.FuLUNEc_lE8jI2KEur0KsQzZFjIh5kymnLdR0Udycxk'
```

  </code-block>
  <code-block label="Response
">

```json
{
  "uploads": [],
  "total": 0
}
```

  </code-block>
</code-group>

## Get Upload

Allows a logged in user to get basic details about a single uploaded image

#### Path

`GET /upload/:fileName`

#### Headers

| Field         | Type   | Description       |
| :------------ | :----- | :---------------- |
| Authorization | string | JWT access token. |

#### Params

| Field    | Type   | Description       |
| :------- | :----- | :---------------- |
| fileName | string | Database fileName |

#### Example

<code-group>
  <code-block label="Request" active>

```sh
curl --location --request GET 'https://www.example.com/api/upload/SAwU6IeByvSWztvrqIGlvCkRtxzrtQWL' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZjRiZmYxMjEwMzdlNDI0YTE3YTNlYmMiLCJpYXQiOjE1OTkyNDE1OTMsImV4cCI6MTU5OTI0MzM5M30.FuLUNEc_lE8jI2KEur0KsQzZFjIh5kymnLdR0Udycxk'
```

  </code-block>
  <code-block label="Response
">

```json
{
  "file": {
    "name": "SAwU6IeByvSWztvrqIGlvCkRtxzrtQWL",
    "displayName": "SAwU6IeByvSWztvrqIGlvCkRtxzrtQWL",
    "size": 342845,
    "tags": ["test", "test2"],
    "url": {
      "file": "http://localhost:3000/u/SAwU6IeByvSWztvrqIGlvCkRtxzrtQWL",
      "delete": "http://localhost:3000/u/SAwU6IeByvSWztvrqIGlvCkRtxzrtQWL/delete?key=VzYzkRfRBkiGL4GPEEDIxO8oAUc3OSZT"
    },
    "deleteKey": "VzYzkRfRBkiGL4GPEEDIxO8oAUc3OSZT"
  }
}
```

  </code-block>
</code-group>

## Get Upload Raw

Allows a logged in user to get the raw image data for a single uploaded image.

#### Path

`GET /upload/:fileName/raw`

#### Params

| Field    | Type   | Description       |
| :------- | :----- | :---------------- |
| fileName | string | Database fileName |

#### Example

<code-group>
  <code-block label="Request" active>

```sh
curl --location --request GET 'https://www.example.com/api/upload/SAwU6IeByvSWztvrqIGlvCkRtxzrtQWL/raw'
```

  </code-block>
  <code-block label="Response
">

```raw
The raw file here example (Note this is a base64 encoded image)
```

  </code-block>
</code-group>

## Upload a file

Allows a logged in user to upload a file to the server

#### Path

`POST /upload`

#### Headers

| Field         | Type   | Description       |
| :------------ | :----- | :---------------- |
| Authorization | string | JWT access token. |

#### Body

| Field       | Type   | Description                                        |
| :---------- | :----- | :------------------------------------------------- |
| stoage      | string | Storge location (Note this must be local for now). |
| displayName | string | Display name of uploaded file.                     |
| tags        | array  | Array of tags for the uplaoded file                |
| file        | file   | File to upload                                     |

#### Example

<code-group>
  <code-block label="Request" active>

```sh
curl -X "POST" "http://localhost:8080/upload" \
     -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MTQzZTQ4N2QxZTQxNDUxYTA1NDE4ODkiLCJpYXQiOjE2MzIyNjkwMTEsImV4cCI6MTYzMjI2OTMxMX0.qpch58DkKAAmvMtN-1_r5tjHWyOmo0aVWRWY1V0U14c' \
     -H 'Content-Type: multipart/form-data; charset=utf-8' \
     -F "file=something.jpg" \
     -F "tags=[\"test\", \"test2\"]"
```

  </code-block>
  <code-block label="Response
">

```json
{
  "file": {
    "name": "SAwU6IeByvSWztvrqIGlvCkRtxzrtQWL",
    "displayName": "SAwU6IeByvSWztvrqIGlvCkRtxzrtQWL",
    "size": 342845,
    "tags": ["test", "test2"],
    "url": {
      "file": "http://localhost:3000/u/SAwU6IeByvSWztvrqIGlvCkRtxzrtQWL",
      "delete": "http://localhost:3000/u/SAwU6IeByvSWztvrqIGlvCkRtxzrtQWL/delete?key=VzYzkRfRBkiGL4GPEEDIxO8oAUc3OSZT"
    },
    "deleteKey": "VzYzkRfRBkiGL4GPEEDIxO8oAUc3OSZT"
  }
}
```

  </code-block>
</code-group>

## Delete files

Allows a logged in user to delete multiple uploaded images

#### Path

`DELETE /upload`

#### Headers

| Field         | Type   | Description       |
| :------------ | :----- | :---------------- |
| Authorization | string | JWT access token. |

<code-group>
  <code-block label="Request" active>

```sh
curl -X "DELETE" "http://localhost:8080/upload" \
     -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MTQzZTQ4N2QxZTQxNDUxYTA1NDE4ODkiLCJpYXQiOjE2MzIyNjkwMTEsImV4cCI6MTYzMjI2OTMxMX0.qpch58DkKAAmvMtN-1_r5tjHWyOmo0aVWRWY1V0U14c'
```

  </code-block>
  <code-block label="Response
">

```json
{
  "code": "IN_PROGRESS",
  "message": "Removing all uploads is in process.  This may take a few mins."
}
```

  </code-block>
</code-group>

## Delete file

Allows a logged in user to delete a single uploaded image.

#### Path

`DELETE /upload/:fileName`

#### Headers

| Field         | Type   | Description       |
| :------------ | :----- | :---------------- |
| Authorization | string | JWT access token. |

#### Params

| Field    | Type   | Description       |
| :------- | :----- | :---------------- |
| fileName | string | Database fileName |

<code-group>
  <code-block label="Request" active>

```sh
curl -X "DELETE" "http://localhost:8080/upload/SAwU6IeByvSWztvrqIGlvCkRtxzrtQWL" \
     -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MTQzZTQ4N2QxZTQxNDUxYTA1NDE4ODkiLCJpYXQiOjE2MzIyNjkwMTEsImV4cCI6MTYzMjI2OTMxMX0.qpch58DkKAAmvMtN-1_r5tjHWyOmo0aVWRWY1V0U14c'
```

  </code-block>
  <code-block label="Response
">

```json
{
  "code": "REMOVED",
  "message": "testing1234 removed."
}
```

  </code-block>
</code-group>

## Update file details

Allows a logged in user to update the details of a single uploaded image

#### Path

`PUT /upload`

#### Headers

| Field         | Type   | Description       |
| :------------ | :----- | :---------------- |
| Authorization | string | JWT access token. |

#### Body

| Field       | Type   | Description                         |
| :---------- | :----- | :---------------------------------- |
| displayName | string | Display name of uploaded file.      |
| tags        | array  | Array of tags for the uplaoded file |

#### Example

<code-group>
  <code-block label="Request" active>

```sh
curl -X "PUT" "http://localhost:8080/upload" \
     -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MTQzZTQ4N2QxZTQxNDUxYTA1NDE4ODkiLCJpYXQiOjE2MzIyNjkwMTEsImV4cCI6MTYzMjI2OTMxMX0.qpch58DkKAAmvMtN-1_r5tjHWyOmo0aVWRWY1V0U14c' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'displayName=testing1234' \
--data-urlencode 'displayName=["test", "test2"]'
```

  </code-block>
  <code-block label="Response
">

```json
{
  "upload": {
    "name": "SAwU6IeByvSWztvrqIGlvCkRtxzrtQWL",
    "displayName": "testing1234",
    "size": 342845,
    "tags": ["test", "test2"],
    "url": {
      "file": "http://localhost:3000/u/SAwU6IeByvSWztvrqIGlvCkRtxzrtQWL",
      "delete": "http://localhost:3000/u/SAwU6IeByvSWztvrqIGlvCkRtxzrtQWL/delete?key=VzYzkRfRBkiGL4GPEEDIxO8oAUc3OSZT"
    },
    "deleteKey": "VzYzkRfRBkiGL4GPEEDIxO8oAUc3OSZT"
  },
  "message": "Upload updated.",
  "code": "UPLOAD_UPDATED"
}
```

  </code-block>
</code-group>
