
const commentRepository = require('../repositories/commentRepository');
const Task = require('../models/Task');

class CommentService {

  async addComment(taskId, data, organizationId) {

    const taskExists = await Task.findOne({ _id: taskId, organizationId });

    if (!taskExists) {
      const err = new Error('Task not found');
      err.status = 404;
      throw err;
    }

    return commentRepository.create({ ...data, taskId, organizationId });

  }

  async listComments(taskId, organizationId, page, limit) {
    return commentRepository.findByTask(taskId, organizationId, page, limit);
  }

  async updateComment(commentId, organizationId, text) {
    return commentRepository.updateComment(commentId, organizationId, text);
  }

  async deleteComment(commentId, organizationId) {
    return commentRepository.deleteComment(commentId, organizationId);
  }

}

module.exports = new CommentService();
