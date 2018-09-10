'use strict'

const express    = require('express')
const app        = express()
const multer     = require('multer')
const handlefile = require('./file_handle')

/* You cant use dotenv library*/
const port = process.env.PORT || 3000

app.use(express.static('storage_files'))

const upload = multer({
  storage: multer.memoryStorage()
})

app.post('/fileupload', upload.array('files', 100), handlefile.AddFile)

app.listen(port, () => {
  console.log('Server running in the port 3000')
})

module.exports = app