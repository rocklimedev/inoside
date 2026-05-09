"use strict";

const asyncHandler = require("../utils/asyncHandler");
const response = require("../utils/response");
const sectionSvc = require("../services/BoqSectionService");

// GET /api/boqs/:boqId/sections
const list = asyncHandler(async (req, res) => {
  const data = await sectionSvc.listByBoq(req.params.boqId);
  return response.success(res, data);
});

// GET /api/sections/:id
const show = asyncHandler(async (req, res) => {
  const data = await sectionSvc.getWithItems(req.params.id);
  return response.success(res, data);
});

// POST /api/boqs/:boqId/sections
const create = asyncHandler(async (req, res) => {
  const data = await sectionSvc.createSection(req.params.boqId, req.body);
  return response.created(res, data, "Section created");
});

// PUT /api/sections/:id
const update = asyncHandler(async (req, res) => {
  const data = await sectionSvc.updateSection(req.params.id, req.body);
  return response.success(res, data, "Section updated");
});

// DELETE /api/sections/:id
const remove = asyncHandler(async (req, res) => {
  await sectionSvc.deleteSection(req.params.id);
  return response.noContent(res);
});

// PATCH /api/boqs/:boqId/sections/reorder
const reorder = asyncHandler(async (req, res) => {
  const data = await sectionSvc.reorder(req.body.items);
  return response.success(res, data, "Sections reordered");
});

module.exports = { list, show, create, update, remove, reorder };
