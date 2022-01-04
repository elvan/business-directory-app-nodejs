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

  const images = [
    'https://images.unsplash.com/photo-1517644493876-7864565e3bf9?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=450&ixid=MnwxfDB8MXxyYW5kb218MHx8cmVzdGF1cmFudHx8fHx8fDE2NDEyODM0Nzg&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800',
    'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=450&ixid=MnwxfDB8MXxyYW5kb218MHx8cmVzdGF1cmFudHx8fHx8fDE2NDEyODM1MDU&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800',
    'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=450&ixid=MnwxfDB8MXxyYW5kb218MHx8cmVzdGF1cmFudHx8fHx8fDE2NDEyODM1MTY&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800',
    'https://images.unsplash.com/photo-1544148103-0773bf10d330?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=450&ixid=MnwxfDB8MXxyYW5kb218MHx8cmVzdGF1cmFudHx8fHx8fDE2NDEyODM1Mjg&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800',
    'https://images.unsplash.com/photo-1574936145840-28808d77a0b6?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=450&ixid=MnwxfDB8MXxyYW5kb218MHx8cmVzdGF1cmFudHx8fHx8fDE2NDEyODM1NDE&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800',
    'https://images.unsplash.com/photo-1542372147193-a7aca54189cd?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=450&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2FmZXx8fHx8fDE2NDEyODM1NzY&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800',
    'https://images.unsplash.com/photo-1426260193283-c4daed7c2024?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=450&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2FmZXx8fHx8fDE2NDEyODM1ODg&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800',
    'https://images.unsplash.com/photo-1497636577773-f1231844b336?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=450&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2FmZXx8fHx8fDE2NDEyODM1OTk&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800',
    'https://images.unsplash.com/photo-1574974051678-44c85748ebcc?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=450&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2FmZXx8fHx8fDE2NDEyODM2MTA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800',
    'https://images.unsplash.com/photo-1593014040390-4f15d7577091?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=450&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2FmZXx8fHx8fDE2NDEyODM2MjI&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800',
    'https://images.unsplash.com/photo-1508766917616-d22f3f1eea14?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=450&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2FmZXx8fHx8fDE2NDEyODM2MzI&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800',
    'https://images.unsplash.com/photo-1563019880-9b2ea5d89a12?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=450&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2FmZXx8fHx8fDE2NDEyODM2NDM&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800',
    'https://images.unsplash.com/photo-1601923157894-eb2f7fffd7d7?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=450&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2FmZXx8fHx8fDE2NDEyODM2NTQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800',
    'https://images.unsplash.com/photo-1615460549969-36fa19521a4f?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=450&ixid=MnwxfDB8MXxyYW5kb218MHx8aG90ZWx8fHx8fHwxNjQxMjgzNjg3&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800',
    'https://images.unsplash.com/photo-1580280126518-3bcec8e0492b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=450&ixid=MnwxfDB8MXxyYW5kb218MHx8cmVzdGF1cmFudHx8fHx8fDE2NDEyODM3MDA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800',
    'https://images.unsplash.com/photo-1589007758669-c58f38192d28?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=450&ixid=MnwxfDB8MXxyYW5kb218MHx8aG90ZWx8fHx8fHwxNjQxMjgzNzEw&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800',
    'https://images.unsplash.com/photo-1607831876417-1b498ff5c7ca?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=450&ixid=MnwxfDB8MXxyYW5kb218MHx8aG90ZWx8fHx8fHwxNjQxMjgzNzIy&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800',
    'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=450&ixid=MnwxfDB8MXxyYW5kb218MHx8cmVzdGF1cmFudHx8fHx8fDE2NDEyODM3MzI&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800',
    'https://images.unsplash.com/photo-1498804103079-a6351b050096?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=450&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2FmZXx8fHx8fDE2NDEyODM3NDQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800',
    'https://images.unsplash.com/photo-1521090029433-afd0d68460f4?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=450&ixid=MnwxfDB8MXxyYW5kb218MHx8aG90ZWx8fHx8fHwxNjQxMjgzNzU2&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800',
  ];

  for (let i = 0; i < 20; i++) {
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
      image: images[i],
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
