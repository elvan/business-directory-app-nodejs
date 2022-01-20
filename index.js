const path = require('path');

const faker = require('@faker-js/faker');
const dotenv = require('dotenv');
const ejsMate = require('ejs-mate');
const express = require('express');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const morgan = require('morgan');

const ExpressError = require('./errors/ExpressError');
const catchAsync = require('./helpers/catchAsync');
const validateBusiness = require('./middleware/validateBusiness');
const validateReview = require('./middleware/validateReview');
const Business = require('./models/business');
const Review = require('./models/review');
const images = require('./seeds/images');

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = Number(process.env.PORT) || 3000;
const MONGODB_URL =
  process.env.MONGODB_URL ||
  'mongodb://localhost:27017/business-directory-app-nodejs';

const app = express();
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

app.use(morgan('tiny'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Homepage, redirect to business listing
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
  validateBusiness,
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
    const id = req.params.id;

    const business = await Business.findById(id);
    const reviews = await Review.find({ business: id }).exec();

    res.render('business/show', {
      business: business,
      reviews: reviews,
    });
  })
);

// Businesses edit page
app.get(
  '/biz-edit/:id',
  catchAsync(async (req, res) => {
    const id = req.params.id;

    const business = await Business.findById(id);

    res.render('business/edit', { business: business });
  })
);

// Businesses update data
app.patch(
  '/biz/:id',
  validateBusiness,
  catchAsync(async (req, res) => {
    const id = req.params.id;

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
    const id = req.params.id;

    await Business.findByIdAndDelete(id);

    res.redirect('/biz');
  })
);

// Add a review
app.post(
  '/biz/:id/reviews',
  validateReview,
  catchAsync(async (req, res) => {
    const id = req.params.id;
    const reviewData = {
      ...req.body.review,
      business: mongoose.Types.ObjectId(id),
    };

    const review = new Review(reviewData);

    await review.save();

    res.redirect(`/biz/${id}`);
  })
);

// 404 page
app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

// Error handler
app.use((err, req, res, next) => {
  if (!err.message) {
    err.message = 'Something went wrong';
  }

  if (!err.statusCode) {
    err.statusCode = 500;
  }

  res.status(err.statusCode).render('error', {
    NODE_ENV: NODE_ENV,
    error: err,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
