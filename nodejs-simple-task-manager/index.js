const express = require('express')
const bodyParser = require('body-parser')

const app = express()

const database = {}

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

app.use((req, res, next) => {
  console.log('----------------------------------')
  console.log('Request Url: ', req.originalUrl)
  console.log('Request Type: ', req.method)
  console.log('Request Pram: ', req.params)
  console.log('Request Body: ', req.body)

  next()
})

app.use((req, res, next) => {
  const oldWrite = res.write
  const oldEnd = res.end
  const chunks = []

  res.write = (chunk) => {
    chunks.push(chunk)
    oldWrite.apply(res, arguments)
  }

  res.end = function (chunk) {
    if (chunk) {
      chunks.push(chunk)
    }
    const body = Buffer.concat(chunks).toString('utf8')
    console.log('Response Body: ', body)
    oldEnd.apply(res, arguments)
  }

  next()
})

app.get('/tasks', (req, res) => {
  const recordList = []

  Object.keys(database).forEach(key => {
    recordList.push(database[key])
  })

  res.send(recordList)
})

app.post('/tasks', (req, res) => {
  let id = 1
  if (Object.keys(database).length !== 0) {
    keyList = Object.keys(database)
    keyList.sort((a, b) => { return a - b })
    id = Number(keyList[keyList.length - 1]) + 1
  }
  const record = {
    id: id,
    title: req.body.title,
    description: req.body.description
  }

  database[id] = record

  res.send(record)
})

app.get('/tasks/:id', (req, res) => {
  const id = req.params.id
  const record = database[id]
  if (id === undefined || record === undefined) {
    res.status(500).send({ message: 'Internal Server Error' })
  }

  res.send(record)
})

app.put('/tasks/:id', (req, res) => {
  const id = req.params.id
  if (id === undefined || database[id] === undefined) {
    res.status(500).send({ message: 'Internal Server Error' })
  }

  const record = {
    id: id,
    title: req.body.title,
    description: req.body.description
  }
  database[id] = record

  res.send(record)
})

app.delete('/tasks/:id', (req, res) => {
  const id = req.params.id
  if (id === undefined || database[id] === undefined) {
    res.status(500).send({ message: 'Internal Server Error' })
  }

  const record = database[id]
  delete database[id]

  res.send(record)
})

const listenPort = process.env.APP_PORT
app.listen(listenPort, () => {
  console.log(`Task Manager listening on port ${listenPort}!`)
})
