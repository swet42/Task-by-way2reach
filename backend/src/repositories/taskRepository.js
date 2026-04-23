const Task = require('../models/Task');

class TaskRepository {

  async create(data) {
    return Task.create(data);
  }

  async findByOrganization(organizationId, page = 1, limit = 5) {

    const skip = (page - 1) * limit;

    const tasks = await Task.find({ organizationId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Task.countDocuments({ organizationId });

    return {
      total,
      page,
      limit,
      data: tasks
    };

  }

  async updateTask(id, data, organizationId) {

    return Task.findOneAndUpdate(
      { _id: id, organizationId },
      data,
      { new: true }
    );

  }

  async deleteTask(id, organizationId) {

    return Task.findOneAndDelete({
      _id: id,
      organizationId
    });

  }

}

module.exports = new TaskRepository();