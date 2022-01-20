const mongoose = require('mongoose');
const faker = require('@faker-js/faker');

const images = require('./images');
const Business = require('../models/business');

const MONGODB_URL =
  process.env.MONGODB_URL ||
  'mongodb://localhost:27017/business-directory-app-nodejs';
const db = mongoose.connection;

console.log('Seeding data...');
console.log(MONGODB_URL);

mongoose.connect(MONGODB_URL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const seedData = async () => {
  await Business.deleteMany({});

  for (let i = 0; i < 20; i++) {
    const business = new Business({
      name: faker.company.companyName(),
      description: faker.lorem.paragraph(),
      category: faker.commerce.department(),
      address: faker.address.streetAddress(),
      city: faker.address.city(),
      state: faker.address.state(),
      zip: faker.address.zipCode(),
      phone: faker.phone.phoneNumber(),
      website: faker.internet.url(),
      image: images[i],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await business.save();
  }
};

seedData().then(() => {
  console.log('Finished seeding data');
  mongoose.connection.close();
  process.exit();
});
