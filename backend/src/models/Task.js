
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  organizationId: { type: String, required: true, index: true }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
