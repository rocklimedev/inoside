"use strict";

const asyncHandler = require("../utils/asyncHandler");
const response = require("../utils/response");
const boqSvc = require("../services/BoqService");

// GET /api/projects/:projectId/boqs
const list = asyncHandler(async (req, res) => {
  const { status, limit, offset } = req.query;
  const data = await boqSvc.listByProject(req.params.projectId, {
    status,
    limit: +limit || 20,
    offset: +offset || 0,
  });
  return response.success(res, data);
});

// GET /api/boqs/:id
const show = asyncHandler(async (req, res) => {
  const data = await boqSvc.getWithSectionsAndItems(req.params.id);
  return response.success(res, data);
});

// POST /api/projects/:projectId/boqs
const create = asyncHandler(async (req, res) => {
  const data = await boqSvc.createBoq({
    ...req.body,
    project_id: req.params.projectId,
  });
  return response.created(res, data, "BOQ created");
});

// PUT /api/boqs/:id
const update = asyncHandler(async (req, res) => {
  const data = await boqSvc.updateBoq(req.params.id, req.body);
  return response.success(res, data, "BOQ updated");
});

// PATCH /api/boqs/:id/status
const changeStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const data = await boqSvc.changeStatus(req.params.id, status);
  return response.success(res, data, `BOQ status changed to ${status}`);
});

// POST /api/boqs/:id/recalculate
const recalculate = asyncHandler(async (req, res) => {
  const { tax_rate = 0 } = req.body;
  const data = await boqSvc.recalculateTotals(req.params.id, +tax_rate);
  return response.success(res, data, "Totals recalculated");
});

// DELETE /api/boqs/:id
const remove = asyncHandler(async (req, res) => {
  await boqSvc.deleteBoq(req.params.id);
  return response.noContent(res);
});

module.exports = {
  list,
  show,
  create,
  update,
  changeStatus,
  recalculate,
  remove,
};
