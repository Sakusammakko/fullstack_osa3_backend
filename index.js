const express = require('express')
const morgan = require('morgan')

const app = express() 
app.use(express.json())

const cors = require('cors')
app.use(cors())

morgan.token('body', (req, res) => 
  req.method === 'POST' 
  ? JSON.stringify(req.body) 
  : '' )



app.use(morgan(':method :url :status :res[content-length] :response-time ms - :body'))

var persons = [
    {
      id: 1,
      name: "Arto Hellas",
      number: "040-123456",
    },
    {
      id: 2,
      name: "Ada Lovelace",
      number: "39-44-5323523",
    },
    {
      id: 3,
      name: "Dan Abramov",
      number: "12-43-234345",
    },
    {
      id: 4,
      name: "Mary Poppendick",
      number: "39-23-6423122",
    }
]
console.log('persons lenght: ', persons.map(person => person.id).length)


app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log('id:', id)
    const person = persons.find(person => person.id === id)
    console.log('person: ', person )

    response.json(person)
})
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }

  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }


const person = {
  id: Math.floor(Math.random() * Math.floor(10000000)),
  name: body.name,
  number: body.number
}

  console.log(person)
  persons = persons.concat(person)

  response.json(person)
}) 

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

app.get('/info', (req, res) => {
    const now = Date()
    console.log('persons lenght: ', persons.lenght)
    res.send(`<p>Phonebook has info for ${persons.map(person => person.id).length} people </p> <p>${now}</p>`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


