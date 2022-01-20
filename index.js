const path = require('path');

const dotenv = require('dotenv');
const ejsMate = require('ejs-mate');
const express = require('express');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const morgan = require('morgan');

const ExpressError = require('./errors/ExpressError');
const businessRouter = require('./routers/businessRouter');
const reviewRouter = require('./routers/reviewRouter');

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

app.get('/', (req, res) => {
  res.render('index');
});

app.use('/biz', businessRouter);
app.use('/biz/:id/reviews', reviewRouter);

// Error 404 page
app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

// Server Error page
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
