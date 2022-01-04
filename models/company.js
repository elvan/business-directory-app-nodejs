const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// With faker.js we can generate fake data for our models.
const CompanySchema = new Schema({
  name: String, // company.companyName
  description: String, // company.catchPhrase
  category: String, // commerce.department
  address: String, // address.streetAddress
  city: String, // address.city
  state: String, // address.state
  zip: String, // address.zipCodeByState
  phone: String, // phone.phoneNumber
  website: String, // internet.url
  createdAt: Date,
  updatedAt: Date,
});

module.exports = mongoose.model('Company', CompanySchema);
