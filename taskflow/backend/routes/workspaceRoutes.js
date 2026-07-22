const express = require('express');
const router = express.Router();
const { getWorkspaces, createWorkspace } = require('../controllers/workspaceController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getWorkspaces);
router.post('/', createWorkspace);

module.exports = router;
