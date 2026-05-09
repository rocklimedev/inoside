"use strict";

const asyncHandler = require("../utils/asyncHandler");
const response = require("../utils/response");
const categorySvc = require("../services/BoqCategoryService");

// GET /api/projects/:projectId/categories
const list = asyncHandler(async (req, res) => {
  const { limit, offset } = req.query;
  const data = await categorySvc.listByProject(req.params.projectId, {
    limit: +limit || 50,
    offset: +offset || 0,
  });
  return response.success(res, data);
});

// GET /api/categories/:id
const show = asyncHandler(async (req, res) => {
  const data = await categorySvc.getWithBoqs(req.params.id);
  return response.success(res, data);
});

// POST /api/projects/:projectId/categories
const create = asyncHandler(async (req, res) => {
  const data = await categorySvc.createCategory(req.params.projectId, req.body);
  return response.created(res, data, "Category created");
});

// PUT /api/categories/:id
const update = asyncHandler(async (req, res) => {
  const data = await categorySvc.updateCategory(req.params.id, req.body);
  return response.success(res, data, "Category updated");
});

// DELETE /api/categories/:id
const remove = asyncHandler(async (req, res) => {
  await categorySvc.deleteCategory(req.params.id);
  return response.noContent(res);
});

module.exports = { list, show, create, update, remove };
