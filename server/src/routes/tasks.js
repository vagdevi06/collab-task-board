const express = require('express');
const router = express.Router({ mergeParams: true });
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/', createTask);
router.get('/', getTasks);
router.patch('/:taskId', updateTask);
router.delete('/:taskId', deleteTask);

module.exports = router;