const faker = require('@faker-js/faker');

const ExpressError = require('../errors/ExpressError');
const catchAsync = require('../helpers/catchAsync');
const Business = require('../models/business');
const Review = require('../models/review');
const images = require('../seeds/images');

exports.fetchAllBusinesses = catchAsync(async (req, res) => {
  const businesses = await Business.find()
    .sort({ createdAt: 'desc' })
    .limit(10)
    .exec();

  res.render('business/index', { businesses: businesses });
});

exports.addBusiness = (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash('error', 'You must be logged in to add a business');

    return res.redirect('/login');
  }

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
};

exports.createBusiness = catchAsync(async (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash('error', 'You must be logged in to add a business');

    return res.redirect('/login');
  }

  const postedBusiness = req.body.business;

  if (!postedBusiness) {
    throw new ExpressError('No business data was provided', 400);
  }

  const newBusiness = new Business(postedBusiness);
  await newBusiness.save();

  req.flash('success', 'Business successfully added!');

  res.redirect(`/biz/${newBusiness._id}`);
});

exports.fetchBusiness = catchAsync(async (req, res) => {
  const id = req.params.id;

  const business = await Business.findById(id);

  if (!business) {
    throw new ExpressError('Business not found', 404);
  }

  const reviews = await Review.find({ business: id })
    .sort({ createdAt: 'desc' })
    .limit(10)
    .exec();

  res.render('business/show', {
    business: business,
    reviews: reviews,
  });
});

exports.editBusiness = catchAsync(async (req, res) => {
  const id = req.params.id;

  const business = await Business.findById(id);

  if (!business) {
    throw new ExpressError('Business not found', 404);
  }

  res.render('business/edit', { business: business });
});

exports.updateBusiness = catchAsync(async (req, res) => {
  const id = req.params.id;

  const editedBusiness = req.body.business;

  if (!editedBusiness) {
    throw new ExpressError('No business data was provided', 400);
  }

  const updatedBusiness = await Business.findByIdAndUpdate(id, editedBusiness, {
    new: true,
  });

  req.flash('success', 'Business successfully updated!');

  res.redirect(`/biz/${updatedBusiness._id}`);
});

exports.deleteBusiness = catchAsync(async (req, res) => {
  const id = req.params.id;

  await Business.findByIdAndDelete(id);

  req.flash('warning', 'Business successfully deleted!');

  res.redirect('/biz');
});
