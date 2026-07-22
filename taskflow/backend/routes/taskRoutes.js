const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask, deleteTask, toggleSubtask, duplicateTask } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .put(updateTask)
  .delete(deleteTask);

router.patch('/:id/subtask/:subtaskId', toggleSubtask);
router.post('/:id/duplicate', duplicateTask);

module.exports = router;
