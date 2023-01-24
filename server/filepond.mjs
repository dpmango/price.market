import path from 'path'
import express from 'express'
import { fileURLToPath } from 'url'

import cors from 'cors'
import multer from 'multer'

const upload = multer({ dest: 'public/images/' })
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(cors())

app.post('/upload', upload.array('attachments', 12), (req, res) => {
  res.send({ success: true })
})

app.use(express.static(path.join(__dirname, 'public')))

app.listen(9000, () => console.log('Filepond backend running on ::9000'))
