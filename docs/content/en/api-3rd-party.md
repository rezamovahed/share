---
title: 3rd Party
description: Simple yet advanced NodeJS, MongoDB and Express based uploader.
position: 21
category: API
---

## Upload a file

Allows a logged in user to upload using a 3rd-party client.

#### Path

`POST /3rd-party/upload`

#### Headers

| Field         | Type   | Description       |
| :------------ | :----- | :---------------- |
| Authorization | string | JWT access token. |

#### Form Data

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
curl --location --request POST 'https://www.example.com/api/3rd-party/upload' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MDc0NWZlN2I1N2UxYTA1OGQ4NDk1NTAiLCJpc3MiOiJTaGFyZSAzcmQtcGFydHkgQVBJIiwiaWF0IjoxNjI1NzkwMjk5LCJleHAiOjQ3NzkzOTAyOTl9.c5zEAyl2TKuinBqezHPPLnQtNOre4lQcM1cCBUzJ_H8' \
--form 'stoage="local"' \
--form 'tags="[\"test\", \"test\"]"' \
--form 'displayName="test"' \
--form 'file=@"~/entrepreneur-593378_1920.jpg"'
```

  </code-block>
  <code-block label="Response
">

```json
{
  "file": {
    "name": "Pp1j8pY5VpBMErLBPU1MkeJ6RAr7IqEs",
    "size": 342845,
    "tags": ["test", "test"],
    "url": {
      "file": "https://www.example.com/u/Pp1j8pY5VpBMErLBPU1MkeJ6RAr7IqEs",
      "delete": "https://www.example.com/u/Pp1j8pY5VpBMErLBPU1MkeJ6RAr7IqEs/delete?key=Y0cujJIIppZjZU9UtP7FApD2fH7YyZ1T"
    },
    "deleteKey": "Y0cujJIIppZjZU9UtP7FApD2fH7YyZ1T"
  }
}
```

  </code-block>
</code-group>

## Delete a file

Allows a logged in user to deletes an uploaded file using a 3rd-party client.

#### Path

`DELETE /3rd-party/upload`

#### Headers

| Field        | Type   | Description                       |
| :----------- | :----- | :-------------------------------- |
| Content-Type | string | application/x-www-form-urlencoded |

#### Body

| Field     | Type   | Description                                        |
| :-------- | :----- | :------------------------------------------------- |
| deleteKey | string | Storge location (Note this must be local for now). |

#### Example

<code-group>
  <code-block label="Request" active>

```sh
curl --location --request DELETE 'https://www.example.com/api/3rd-party/upload' \
--data-urlencode'deleteKey="Y0cujJIIppZjZU9UtP7FApD2fH7YyZ1T"'
```

  </code-block>
  <code-block label="Response
">

```json
{
  "code": "REMOVED",
  "message": "Pp1j8pY5VpBMErLBPU1MkeJ6RAr7IqEs removed."
}
```

  </code-block>
</code-group>
