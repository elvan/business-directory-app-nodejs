const express = require('express');
const {
  fetchAllBusinesses,
  createBusiness,
  addBusiness,
  fetchBusiness,
  editBusiness,
  deleteBusiness,
  updateBusiness,
} = require('../controllers/businessController');
const { isLoggedIn } = require('../middleware/isLoggedIn');
const validateBusiness = require('../middleware/validateBusiness');

const router = express.Router();

router.get('/', fetchAllBusinesses);

router.get('/add', isLoggedIn, addBusiness);

router.post('/', isLoggedIn, validateBusiness, createBusiness);

router.get('/:id', fetchBusiness);

router.get('/:id/edit', isLoggedIn, editBusiness);

router.patch('/:id', isLoggedIn, validateBusiness, updateBusiness);

router.delete('/:id', isLoggedIn, deleteBusiness);

module.exports = router;
