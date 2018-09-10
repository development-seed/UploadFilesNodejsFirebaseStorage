'use strict'

const googleStorage = require('@google-cloud/storage')
const shortid = require('shortid')

const storage = googleStorage({
  keyFilename: `${__dirname}/credentials/firebase_storage.json`
})

/* Change - YOUR_STORAGE_BUCKET */
const bucket = storage.bucket('gs://db-firebase-5cf99.appspot.com')

let tokenId = shortid.generate()

const UploadStorageFirebase = (files) => {

  let prom = new Promise((_resolve, _reject) => {

    let arrayFile = []

    if (files.length <= 0)
      _reject('Not file')

    files.map((file, i) => {

      let nameFile = `${Date.now()}${i}`
      let nameFolder = 'myfiles'
      let newFileName = `${nameFolder}/${nameFile}`

      let fileUpload = bucket.file(newFileName)

      const blobStream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype,
          metadata: {
            firebaseStorageDownloadTokens: tokenId
          }
        },
      })

      blobStream.on('error', error => {
        _reject(error)
      })

      blobStream.on('finish', data => {

        const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileUpload.name)}?alt=media&token=${tokenId}`

        fileUpload.getSignedUrl({ action: 'read' })

        arrayFile.push({
          _id: nameFile.toString(),
          url: url,
          type: file.mimetype
        })

        if (arrayFile.length == (files.length))
          _resolve(arrayFile)

      })

      blobStream.end(file.buffer)

    })

  })

  return prom
}

exports.AddFile = async (req, res) => {

  try {

    const { files } = req

    if (files.length > 0) {

      const response = await UploadStorageFirebase(files)
      return res.status(200).send(response)

    }

    return res.status(400).send({
      status: 'File required'
    })

  } catch (error) {

    return res.status(400).send({
      status: 'an error has ocurred'
    })
    
  }

}