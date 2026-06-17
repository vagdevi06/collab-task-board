const Task = require('../models/Task');
const { publisher } = require('../config/redis');

const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, assignee } = req.body;
    const task = await Task.create({
      title, description, status, priority, assignee,
      board: req.params.boardId,
      createdBy: req.user._id,
    });
    const populated = await task.populate('assignee createdBy', 'name email');
    publisher.publish(`board:${req.params.boardId}`, JSON.stringify({ type: 'TASK_CREATED', task: populated }));
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ board: req.params.boardId })
      .populate('assignee createdBy', 'name email');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.taskId, req.body, { new: true })
      .populate('assignee createdBy', 'name email');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    publisher.publish(`board:${req.params.boardId}`, JSON.stringify({ type: 'TASK_UPDATED', task }));
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.taskId);
    publisher.publish(`board:${req.params.boardId}`, JSON.stringify({ type: 'TASK_DELETED', taskId: req.params.taskId }));
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };