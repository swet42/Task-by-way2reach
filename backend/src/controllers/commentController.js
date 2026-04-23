
const commentService = require('../services/commentService');
const Response = require('../utils/response');

const DEFAULT_ORG_ID = 'org2';

class CommentController {

  async add(req, res, next) {
    try {

      const org = req.headers['x-organization-id'] || DEFAULT_ORG_ID;
      const { taskId } = req.params;

      const comment = await commentService.addComment(taskId, req.body, org);

      return Response.success(res, comment, 'Comment added', 201);

    } catch (error) {
      next(error);
    }
  }

  async list(req, res, next) {
    try {

      const org = req.headers['x-organization-id'] || DEFAULT_ORG_ID;
      const { taskId } = req.params;

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const comments = await commentService.listComments(taskId, org, page, limit);

      return Response.success(res, comments);

    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {

      const org = req.headers['x-organization-id'] || DEFAULT_ORG_ID;
      const { commentId } = req.params;

      const comment = await commentService.updateComment(commentId, org, req.body.text);

      if (!comment) {
        return Response.error(res, 'Comment not found', 404);
      }

      return Response.success(res, comment, 'Comment updated');

    } catch (error) {
      next(error);
    }
  }

  async remove(req, res, next) {
    try {

      const org = req.headers['x-organization-id'] || DEFAULT_ORG_ID;
      const { commentId } = req.params;

      const comment = await commentService.deleteComment(commentId, org);

      if (!comment) {
        return Response.error(res, 'Comment not found', 404);
      }

      return Response.success(res, null, 'Comment deleted');

    } catch (error) {
      next(error);
    }
  }

}

module.exports = new CommentController();
