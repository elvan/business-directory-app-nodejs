const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const faker = require('faker');
const methodOverride = require('method-override');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');

const PORT = process.env.PORT || 3000;

const images = require('./seeds/images');
const Business = require('./models/business');

const app = express();
const db = mongoose.connection;

const mongodbUri = `${process.env.MONGODB_SERVER}/business-directory-app-nodejs`;

mongoose.connect(mongodbUri, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
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

app.get('/biz', async (req, res) => {
  const businesses = await Business.find().limit(10).exec();

  res.render('business/index', { businesses: businesses });
});

app.get('/biz-add', (req, res) => {
  const randomImage = images[Math.floor(Math.random() * images.length)];

  // pre-populate the form with fake data
  const business = new Business({
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

  res.render('business/add', { business: business });
});

app.post('/biz', async (req, res) => {
  const postedBusiness = req.body.business;
  postedBusiness.createdAt = new Date();
  postedBusiness.updatedAt = new Date();

  const newBusiness = new Business(postedBusiness);
  await newBusiness.save();

  res.redirect(`/biz/${newBusiness._id}`);
});

app.get('/biz/:id', async (req, res) => {
  const { id } = req.params;

  const business = await Business.findById(id);

  res.render('business/show', { business: business });
});

app.get('/biz-edit/:id', async (req, res) => {
  const { id } = req.params;

  const business = await Business.findById(id);

  res.render('business/edit', { business: business });
});

app.patch('/biz/:id', async (req, res) => {
  const { id } = req.params;

  const editedBusiness = req.body.business;
  editedBusiness.updatedAt = new Date();

  const updatedBusiness = await Business.findByIdAndUpdate(id, editedBusiness, {
    new: true,
  });

  res.redirect(`/biz/${updatedBusiness._id}`);
});

app.delete('/biz/:id', async (req, res) => {
  const { id } = req.params;

  await Business.findByIdAndDelete(id);

  res.redirect('/biz');
});

app.use((req, res) => {
  res.status(404).render('error/404');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error/500');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
