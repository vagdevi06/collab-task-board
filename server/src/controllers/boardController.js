const Board = require('../models/Board');

const createBoard = async (req, res) => {
  try {
    const { name, description } = req.body;
    const board = await Board.create({ name, description, owner: req.user._id, members: [req.user._id] });
    res.status(201).json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getBoards = async (req, res) => {
  try {
    const boards = await Board.find({ members: req.user._id }).populate('owner', 'name email');
    res.json(boards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getBoardById = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id).populate('members', 'name email');
    if (!board) return res.status(404).json({ message: 'Board not found' });
    res.json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteBoard = async (req, res) => {
  try {
    await Board.findByIdAndDelete(req.params.id);
    res.json({ message: 'Board deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createBoard, getBoards, getBoardById, deleteBoard };