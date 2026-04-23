const taskService = require('../services/taskService');
const Response = require('../utils/response');

const DEFAULT_ORG_ID = 'org2';

class TaskController {

  async create(req, res, next) {
    try {

      const org = req.headers['x-organization-id'] || DEFAULT_ORG_ID;

      const task = await taskService.createTask(req.body, org);

      return Response.success(res, task, "Task created", 201);

    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {

      const org = req.headers['x-organization-id'] || DEFAULT_ORG_ID;

      const task = await taskService.updateTask(
        req.params.id,
        req.body,
        org
      );

      if (!task) {
        return Response.error(res, "Task not found", 404);
      }

      return Response.success(res, task, "Task updated");

    } catch (error) {
      next(error);
    }
  }

  async list(req, res, next) {
    try {

      const org = req.headers['x-organization-id'] || DEFAULT_ORG_ID;

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;

      const tasks = await taskService.listTasks(org, page, limit);

      return Response.success(res, tasks);

    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {

      const org = req.headers['x-organization-id'] || DEFAULT_ORG_ID;

      const task = await taskService.deleteTask(
        req.params.id,
        org
      );

      if (!task) {
        return Response.error(res, "Task not found", 404);
      }

      return Response.success(res, null, "Task deleted");

    } catch (error) {
      next(error);
    }
  }

}

module.exports = new TaskController();
