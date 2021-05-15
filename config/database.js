const mongoose = require('mongoose')

const connectDB = async function () {
  const connect = await mongoose.connect(process.env.DB_KEY, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })

  console.log(`MongoDB Connected: ${connect.connection.host}`.bgGreen.black)
}

module.exports = connectDB
