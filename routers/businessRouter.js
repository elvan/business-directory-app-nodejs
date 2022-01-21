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
const validateBusiness = require('../middleware/validateBusiness');

const router = express.Router();

router.get('/', fetchAllBusinesses);

router.get('/add', addBusiness);

router.post('/', validateBusiness, createBusiness);

router.get('/:id', fetchBusiness);

router.get('/:id/edit', editBusiness);

router.patch('/:id', validateBusiness, updateBusiness);

router.delete('/:id', deleteBusiness);

module.exports = router;
