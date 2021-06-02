const path = require('path')
const axios = require('axios')
const app = require('express')()

app.all('/:upload_id', async (req, res, next) => {
  try {
    const uploadID = path.parse(req.params.upload_id).name
    await axios({
      method: 'GET',
      url: `${process.env.API_ENDPOINT_URL}/upload/${uploadID}/raw`,
      responseType: 'stream',
    }).then((upload) => {
      res.set({ 'Content-Type': upload.headers['content-type'] })
      res.set({ 'Content-Length': upload.headers['content-length'] })
      upload.data.pipe(res)
    })
  } catch (e) {
    next()
  }
})

module.exports = app
