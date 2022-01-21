const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const MONGODB_URL =
  process.env.MONGODB_URL ||
  'mongodb://localhost:27017/business-directory-app-nodejs';

function connectToDatabase() {
  // Database
  const db = mongoose.connection;

  mongoose.connect(MONGODB_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });

  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => {
    console.log('Connected to MongoDB');
  });
}

module.exports = connectToDatabase;
