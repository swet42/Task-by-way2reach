
const express = require('express');
const router = express.Router({ mergeParams: true });

const commentController = require('../controllers/commentController');
const validate = require('../middlewares/validate');

const { headerSchema } = require('../validators/taskValidator');
const { addCommentSchema, updateCommentSchema, listCommentSchema, taskParamSchema, commentIdParamSchema } = require('../validators/commentValidator');

router.post(
  '/',
  validate(headerSchema, 'headers'),
  validate(taskParamSchema, 'params'),
  validate(addCommentSchema),
  commentController.add
);

router.get(
  '/',
  validate(headerSchema, 'headers'),
  validate(taskParamSchema, 'params'),
  validate(listCommentSchema, 'query'),
  commentController.list
);

router.put(
  '/:commentId',
  validate(headerSchema, 'headers'),
  validate(commentIdParamSchema, 'params'),
  validate(updateCommentSchema),
  commentController.update
);

router.delete(
  '/:commentId',
  validate(headerSchema, 'headers'),
  validate(commentIdParamSchema, 'params'),
  commentController.remove
);

module.exports = router;
