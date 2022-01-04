const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const faker = require('faker');
const methodOverride = require('method-override');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');

const PORT = process.env.PORT || 3000;

const images = require('./seeds/images');
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

app.use(morgan('tiny'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/companies', async (req, res) => {
  const companies = await Company.find().limit(10).exec();

  res.render('companies/index', { companies });
});

app.get('/companies/new', (req, res) => {
  const randomImage = images[Math.floor(Math.random() * images.length)];

  // pre-populate the form with fake data
  const company = new Company({
    name: faker.company.companyName(),
    description: faker.company.catchPhrase(),
    category: faker.commerce.department(),
    address: faker.address.streetAddress(),
    city: faker.address.city(),
    state: faker.address.state(),
    zip: faker.address.zipCode(),
    phone: faker.phone.phoneNumber(),
    website: faker.internet.url(),
    image: randomImage,
  });

  res.render('companies/new', { company });
});

app.post('/companies', async (req, res) => {
  const postedCompany = req.body.company;
  postedCompany.createdAt = new Date();
  postedCompany.updatedAt = new Date();

  const newCompany = new Company(postedCompany);
  await newCompany.save();

  res.redirect(`/companies/${newCompany._id}`);
});

app.get('/companies/:id', async (req, res) => {
  const { id } = req.params;

  const company = await Company.findById(id);

  res.render('companies/show', { company });
});

app.get('/companies/:id/edit', async (req, res) => {
  const { id } = req.params;

  const company = await Company.findById(id);

  res.render('companies/edit', { company });
});

app.patch('/companies/:id', async (req, res) => {
  const { id } = req.params;

  const editedCompany = req.body.company;
  editedCompany.updatedAt = new Date();

  const updatedCompany = await Company.findByIdAndUpdate(id, editedCompany, {
    new: true,
  });

  res.redirect(`/companies/${updatedCompany._id}`);
});

app.delete('/companies/:id', async (req, res) => {
  const { id } = req.params;

  await Company.findByIdAndDelete(id);

  res.redirect('/companies');
});

app.use((req, res) => {
  res.status(404).render('errors/404');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
