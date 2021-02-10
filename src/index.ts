import express from 'express'

const port = process.env.PORT || 3100

const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`App is run in: ${port}`)
})
