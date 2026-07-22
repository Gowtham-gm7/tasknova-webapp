const express = require('express');
const router = express.Router();
const { getAdminData } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

router.get('/data', protect, admin, getAdminData);

module.exports = router;
