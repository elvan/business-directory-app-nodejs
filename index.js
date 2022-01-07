const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const faker = require('faker');
const methodOverride = require('method-override');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');

const catchAsync = require('./helpers/catchAsync');
const ExpressError = require('./errors/ExpressError');
const images = require('./seeds/images');
const Business = require('./models/business');

const PORT = process.env.PORT || 3000;

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

// Homepage
app.get('/', (req, res) => {
  res.render('index');
});

// Businesses index page
app.get(
  '/biz',
  catchAsync(async (req, res) => {
    const businesses = await Business.find().limit(10).exec();

    res.render('business/index', { businesses: businesses });
  })
);

// Businesses add page
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

// Businesses create data
app.post(
  '/biz',
  catchAsync(async (req, res) => {
    const postedBusiness = req.body.business;

    if (!postedBusiness) {
      throw new ExpressError('No business data was provided', 400);
    }

    postedBusiness.createdAt = new Date();
    postedBusiness.updatedAt = new Date();

    const newBusiness = new Business(postedBusiness);
    await newBusiness.save();

    res.redirect(`/biz/${newBusiness._id}`);
  })
);

// Businesses show page
app.get(
  '/biz/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params;

    const business = await Business.findById(id);

    res.render('business/show', { business: business });
  })
);

// Businesses edit page
app.get(
  '/biz-edit/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params;

    const business = await Business.findById(id);

    res.render('business/edit', { business: business });
  })
);

// Businesses update data
app.patch(
  '/biz/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params;

    const editedBusiness = req.body.business;

    if (!editedBusiness) {
      throw new ExpressError('No business data was provided', 400);
    }

    editedBusiness.updatedAt = new Date();

    const updatedBusiness = await Business.findByIdAndUpdate(
      id,
      editedBusiness,
      {
        new: true,
      }
    );

    res.redirect(`/biz/${updatedBusiness._id}`);
  })
);

// Businesses delete data
app.delete(
  '/biz/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params;

    await Business.findByIdAndDelete(id);

    res.redirect('/biz');
  })
);

// 404 page
app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

// Error handler
app.use((err, req, res, next) => {
  const { message = 'Something went wrong', statusCode = 500 } = err;

  res.status(statusCode).send(message);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
