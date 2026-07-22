const express = require('express');
const router = express.Router();
const { parseTask } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.post('/parse-task', protect, parseTask);

module.exports = router;
