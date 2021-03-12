// aKxDnxgnlOZggr0P

const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
console.log('argumentit: ', process.argv)

const url =
    `mongodb+srv://Saku:${password}@cluster0.4jgtq.mongodb.net/Persons?retryWrites=true&w=majority`
console.log('url: ', url)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })


const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: process.argv[3],
  number: process.argv[4]
})

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
} else {
  person.save().then(() => {
    console.log('person saved!')
    mongoose.connection.close()
  })
}




