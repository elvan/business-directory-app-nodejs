const mongoose = require('mongoose');
const faker = require('faker');

const Company = require('../models/company');

const db = mongoose.connection;

const mongodbUri = process.env.MONGODB_SERVER + 'business-directory-app-nodejs';

console.log('Seeding data...');
console.log(mongodbUri);

mongoose.connect(mongodbUri, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const seedData = async () => {
  await Company.deleteMany({});

  for (let i = 0; i < 100; i++) {
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

    await company.save();
  }
};

seedData().then(() => {
  console.log('Finished seeding data');
  mongoose.connection.close();
  process.exit();
});
