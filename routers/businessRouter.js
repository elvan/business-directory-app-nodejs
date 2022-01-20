const express = require('express');
const {
  fetchAllBusinesses,
  createBusiness,
  addBusinessForm,
  fetchBusiness,
  editBusinessForm,
  deleteBusiness,
  updateBusiness,
} = require('../controllers/businessController');
const validateBusiness = require('../middleware/validateBusiness');

const router = express.Router();

router.get('/', fetchAllBusinesses);

router.get('/add', addBusinessForm);

router.post('/', validateBusiness, createBusiness);

router.get('/:id', fetchBusiness);

router.get('/:id/edit', editBusinessForm);

router.patch('/:id', validateBusiness, updateBusiness);

router.delete('/:id', deleteBusiness);

module.exports = router;
