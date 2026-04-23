const Joi = require('joi');

const headerSchema = Joi.object({
  'x-organization-id': Joi.string()
    .min(2)
    .optional()
}).unknown(true); // allow other headers

const createTaskSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .required(),

  description: Joi.string()
    .allow('', null)
});

const updateTaskSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100),

  description: Joi.string()
    .allow('', null)
});

const listTaskSchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(5)
});

const taskIdParamSchema = Joi.object({
  id: Joi.string()
    .length(24)
    .hex()
    .required()
});

module.exports = {
  headerSchema,
  createTaskSchema,
  updateTaskSchema,
  listTaskSchema,
  taskIdParamSchema
};  
