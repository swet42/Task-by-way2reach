
const Comment = require('../models/Comment');

class CommentRepository {

  async create(data) {
    return Comment.create(data);
  }

  async findByTask(taskId, organizationId, page = 1, limit = 10) {

    const skip = (page - 1) * limit;

    const comments = await Comment.find({ taskId, organizationId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Comment.countDocuments({ taskId, organizationId });

    return {
      total,
      page,
      limit,
      data: comments
    };

  }

  async updateComment(id, organizationId, text) {
    return Comment.findOneAndUpdate(
      { _id: id, organizationId },
      { text },
      { new: true }
    );
  }

  async deleteComment(id, organizationId) {
    return Comment.findOneAndDelete({ _id: id, organizationId });
  }

  async deleteByTask(taskId, organizationId) {
    return Comment.deleteMany({ taskId, organizationId });
  }

}

module.exports = new CommentRepository();
