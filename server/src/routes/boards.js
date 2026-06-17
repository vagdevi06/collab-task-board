const express = require('express');
const router = express.Router();
const { createBoard, getBoards, getBoardById, deleteBoard } = require('../controllers/boardController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/', createBoard);
router.get('/', getBoards);
router.get('/:id', getBoardById);
router.delete('/:id', deleteBoard);

module.exports = router;