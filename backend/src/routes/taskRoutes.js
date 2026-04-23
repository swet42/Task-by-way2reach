const express = require('express');
const router = express.Router();

const taskController = require('../controllers/taskController');
const validate = require('../middlewares/validate');
const commentRoutes = require('./commentRoutes');

const {
  headerSchema,
  createTaskSchema,
  updateTaskSchema,
  listTaskSchema,
  taskIdParamSchema
} = require('../validators/taskValidator');

router.post(
  '/',
  validate(headerSchema, "headers"),
  validate(createTaskSchema),
  taskController.create
);

router.get(
  '/',
  validate(headerSchema, "headers"),
  validate(listTaskSchema, "query"),
  taskController.list
);

router.put(
  '/:id',
  validate(headerSchema, "headers"),
  validate(taskIdParamSchema, "params"),
  validate(updateTaskSchema),
  taskController.update
);

router.delete(
  '/:id',
  validate(headerSchema, "headers"),
  validate(taskIdParamSchema, "params"),
  taskController.delete
);

router.use('/:taskId/comments', commentRoutes);

module.exports = router;