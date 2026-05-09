"use strict";

const asyncHandler = require("../utils/asyncHandler");
const response = require("../utils/response");
const projectSvc = require("../services/BoqProjectService");

// GET /api/projects
const list = asyncHandler(async (req, res) => {
  const { limit, offset } = req.query;
  const data = await projectSvc.list({
    limit: +limit || 20,
    offset: +offset || 0,
  });
  return response.success(res, data);
});

// GET /api/projects/:id
const show = asyncHandler(async (req, res) => {
  const data = await projectSvc.getWithDetails(req.params.id);
  return response.success(res, data);
});

// POST /api/projects
const create = asyncHandler(async (req, res) => {
  const data = await projectSvc.createProject(req.body);
  return response.created(res, data, "Project created");
});

// PUT /api/projects/:id
const update = asyncHandler(async (req, res) => {
  const data = await projectSvc.updateProject(req.params.id, req.body);
  return response.success(res, data, "Project updated");
});

// DELETE /api/projects/:id
const remove = asyncHandler(async (req, res) => {
  await projectSvc.deleteProject(req.params.id);
  return response.noContent(res);
});

module.exports = { list, show, create, update, remove };
