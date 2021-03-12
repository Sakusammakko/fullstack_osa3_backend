require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express() 
app.use(express.json())

app.use(express.static('build'))

const cors = require('cors')
const { json } = require('express')
app.use(cors())

morgan.token('body', (req, res) => 
  req.method === 'POST' 
  ? JSON.stringify(req.body) 
  : '' )



app.use(morgan(':method :url :status :res[content-length] :response-time ms - :body'))

console.log('persons lenght: ', persons.map(person => person.id).length)


app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(people => {
    response.json(people)
  })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  console.log('request:', request.params.id)
  Person.findById(request.params.id)
    .then(result => {
      console.log('result: ', result)
      response.json(result)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person ({
    name: body.name,
    number: body.number
  })

  console.log('person: ', person)
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  const now = Date()
  Person.find({})
    .then(result => {
      response.send(`<p>Phonebook has info for ${result.map(person => person.id).length} people </p> <p>${now}</p>`)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.use(morgan(':method :url :status :res[content-length] :response-time ms - :body'))

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


