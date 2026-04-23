const taskRepository = require('../repositories/taskRepository');

class TaskService {

  async createTask(data, organizationId) {

    return taskRepository.create({
      ...data,
      organizationId
    });

  }

  async updateTask(id, data, organizationId) {

    return taskRepository.updateTask(
      id,
      data,
      organizationId
    );

  }

  async listTasks(organizationId, page, limit) {

    return taskRepository.findByOrganization(
      organizationId,
      page,
      limit
    );

  }

  async deleteTask(id, organizationId) {

    return taskRepository.deleteTask(
      id,
      organizationId
    );

  }

}

module.exports = new TaskService();