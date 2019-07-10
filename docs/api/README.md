# Share API Docs

Where full URLs are provided in responses they will be rendered as if service is running.

## Endpoints that require Authentication

Closed endpoints require a valid Token to be included in the header of the
request. A Token can be acquired from the your account in your api keys.

### Uploading files and images

This endpoint uploads your file/image and adds a tag to it if its one of the approved images so it can be displayed in gallery.

* [Upload](upload/post.md) : `POST /api/upload/`

### Delete file or image

This endpoint delete the file using the files delete code.  Where is given when you upload a file.

* [Delete](delete/get.md) : `GET /api/upload/`
