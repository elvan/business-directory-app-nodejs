const path = require('path');

const express = require('express');
const mongoose = require('mongoose');

const Company = require('./models/company');

const app = express();
const db = mongoose.connection;

const mongodbUri = process.env.MONGODB_SERVER + 'business-directory-app-nodejs';

mongoose.connect(mongodbUri, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/companies', async (req, res) => {
  const companies = await Company.find().limit(10).exec();

  res.render('companies/index', { companies });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
