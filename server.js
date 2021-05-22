require('dotenv').config()
const express = require('express')
const app = express()

app.use(express.static('.'))
app.use(express.json())

app.get('/test', (req, res) => {
  res.status(400).send({msg:'error'})
})

app.listen(4242, () => console.log('Node server listening on port 4242!'))
