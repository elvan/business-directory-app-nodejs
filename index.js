const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const faker = require('faker');

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

app.get('/generate-company', async (req, res) => {
  const company = new Company({
    name: faker.company.companyName(),
    description: faker.company.catchPhrase(),
    category: faker.commerce.department(),
    address: faker.address.streetAddress(),
    city: faker.address.city(),
    state: faker.address.state(),
    zip: faker.address.zipCodeByState(),
    phone: faker.phone.phoneNumber(),
    website: faker.internet.url(),
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // await company.save();

  res.json(company);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
