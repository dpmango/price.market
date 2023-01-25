import path from 'path'
import express from 'express'
import { fileURLToPath } from 'url'

import cors from 'cors'
import multer from 'multer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// multer storage for upload file.
var storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'public/images')
  },
  filename: (req, file, callback) => {
    var name = file.originalname + '-' + Date.now()

    callback(null, name)
  },
})

const fileFilter = (req, file, cb) => {
  const mimeWhitelist = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'video/mp4']
  const allowed = mimeWhitelist.includes(file.mimetype)

  console.log({ file: file.originalname }, allowed)
  cb(null, allowed)
}

const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 }, fileFilter })

// express app
const app = express()
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))

// routes
app.post('/filepond', upload.array('filepond', 10), (req, res, next) => {
  // const files = req.files
  const { files, errored } = req

  if (!files?.length) {
    const error = new Error(errored || 'upload eror')
    error.httpStatusCode = 400
    return next(error)
  }

  res.status(200).send({
    files: files.map((x) => ({
      name: x.filename,
      size: x.size,
    })),
  })
})

// listener
app.listen(9000, () => console.log('Filepond backend running on ::9000'))
