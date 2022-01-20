const mongoose = require('mongoose');

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
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Business = mongoose.model('Business', BusinessSchema);

module.exports = Business;
