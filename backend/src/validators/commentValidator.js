
const Joi = require('joi');

const addCommentSchema = Joi.object({
  text: Joi.string().min(1).max(1000).required()
});

const listCommentSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(500).default(10)
});

const updateCommentSchema = Joi.object({
  text: Joi.string().min(1).max(1000).required()
});

const taskParamSchema = Joi.object({
  taskId: Joi.string().length(24).hex().required()
});

const commentIdParamSchema = Joi.object({
  taskId: Joi.string().length(24).hex().required(),
  commentId: Joi.string().length(24).hex().required()
});

module.exports = {
  addCommentSchema,
  updateCommentSchema,
  listCommentSchema,
  taskParamSchema,
  commentIdParamSchema
};
