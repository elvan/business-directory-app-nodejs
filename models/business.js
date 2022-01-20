const mongoose = require('mongoose');

const Review = require('./review');

const Schema = mongoose.Schema;

const BusinessSchema = new Schema(
  {
    name: String, // company.companyName
    description: String, // company.catchPhrase
    category: String, // commerce.department
    address: String, // address.streetAddress
    city: String, // address.city
    state: String, // address.state
    zip: String, // address.zipCode
    phone: String, // phone.phoneNumber
    website: String, // internet.url
    image: String, // from Unsplash
  },
  {
    timestamps: true,
  }
);

BusinessSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Review.deleteMany({ business: doc._id });
  }
});

const Business = mongoose.model('Business', BusinessSchema);

module.exports = Business;
