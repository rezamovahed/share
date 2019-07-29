# Upload file or image

Create an Account for the authenticated User if an Account for that User does
not already exist. Each User can only have one Account.

**URL** : `/api/upload/`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : None

**Data constraints**

Provide file in a __Form Data (mulitpart/form-data)__

```body
{
    "file": file
}
```

## Success Response

**Condition** : If everything is OK and an Account didn't exist for this User.

**Code** : `200 Success`

**Content example**

```json
{
  "success": true,
  "file": {
    "url": "http://localhost:5050/u/Rw6M4jVuSeiKjzJh.png",
    "delete": "http://localhost:5050/api/delete?fileName=Rw6M4jVuSeiKjzJh.png&key=1b861ad1153a5990c77f323fdcc08493"
  }
}
```

## Error Responses

**Condition** : No File was provided

**Code** : `400 BAD REQUEST`

**Content example**

```json
{
  auth: true,
  success: false,
  error: {
      message: 'No file was provided.'
  }
};
```

### Or

**Condition** : if file check is enabled and the file is not on the whitelist

**Code** : `400 BAD REQUEST`

**Content example**

```json
{
  auth: true,
  success: false,
  error: {
    message: 'Invaid File uploaded.'
  }
}
```

### Or

**Condition** : No auth provided

**Code** : `401 BAD REQUEST`

**Content example**

```json
{
 auth: false,
 success: false,
 error: {
   authorization: 'No authorization provided.'
 }
}
```

### Or

**Condition** : Invaid auth

**Code** : `401 BAD REQUEST`

**Content example**

```json
{
 auth: false,
 success: false,
 error: {
   authorization: 'Invaid api key provided.'
 }
}
```

### Or

**Condition** : File fails to upload

**Code** : `400 BAD REQUEST`

**Content example**

```json
Error in uploading
```
