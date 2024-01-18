const mongoose = require('mongoose')

const withDB = async serverListener => {
    try {const x= await 
mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
   console.log(`Connected to Database: "${x.connections[0].name}"`)
  if (typeof serverListener === 'function') {
    serverListener()
  }
} catch (error) {
    console.error('Error connecting to mongo: ', err)
  }
}
module.exports = withDB