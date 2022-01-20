const faker = require('@faker-js/faker');
const mongoose = require('mongoose');

const images = require('./images');
const Business = require('../models/business');
const Review = require('../models/review');

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
  await Review.deleteMany({});

  // Create fake businesses
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
    });

    await business.save();

    // Create fake reviews
    for (let j = 0; j < faker.datatype.number({ min: 1, max: 10 }); j++) {
      const randomNumber = faker.datatype.number({ min: 0, max: 100 });
      let rating = 0;

      // 50% chance of being a 5 star review
      if (randomNumber >= 50) {
        rating = 5;
      }
      // 20% chance
      else if (randomNumber >= 30 && randomNumber < 50) {
        rating = 4;
      }
      // 15% chance
      else if (randomNumber >= 15 && randomNumber < 30) {
        rating = 3;
      }
      // 10% chance
      else if (randomNumber >= 5 && randomNumber < 15) {
        rating = 2;
      }
      // 5% chance
      else {
        rating = 1;
      }

      const review = new Review({
        rating: rating,
        comment: faker.lorem.paragraph(),
        business: business._id,
      });

      await review.save();
    }
  }
};

seedData().then(() => {
  console.log('Finished seeding data');
  mongoose.connection.close();
  process.exit();
});
