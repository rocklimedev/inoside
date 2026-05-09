"use strict";

const asyncHandler = require("../utils/asyncHandler");
const response = require("../utils/response");
const itemSvc = require("../services/BoqItemService");

// GET /api/sections/:sectionId/items
const list = asyncHandler(async (req, res) => {
  const data = await itemSvc.listBySection(req.params.sectionId);
  return response.success(res, data);
});

// GET /api/items/:id
const show = asyncHandler(async (req, res) => {
  const data = await itemSvc.getItem(req.params.id);
  return response.success(res, data);
});

// POST /api/boqs/:boqId/sections/:sectionId/items
const create = asyncHandler(async (req, res) => {
  const { boqId, sectionId } = req.params;
  const data = await itemSvc.createItem(boqId, sectionId, req.body);
  return response.created(res, data, "Item created");
});

// PUT /api/items/:id
const update = asyncHandler(async (req, res) => {
  const data = await itemSvc.updateItem(req.params.id, req.body);
  return response.success(res, data, "Item updated");
});

// DELETE /api/items/:id
const remove = asyncHandler(async (req, res) => {
  await itemSvc.deleteItem(req.params.id);
  return response.noContent(res);
});

// POST /api/boqs/:boqId/sections/:sectionId/items/bulk
const bulkCreate = asyncHandler(async (req, res) => {
  const { boqId, sectionId } = req.params;
  const data = await itemSvc.bulkCreate(boqId, sectionId, req.body.items);
  return response.created(res, data, `${data.length} items created`);
});

// PATCH /api/sections/:sectionId/items/reorder
const reorder = asyncHandler(async (req, res) => {
  const data = await itemSvc.reorder(req.body.items);
  return response.success(res, data, "Items reordered");
});

module.exports = { list, show, create, update, remove, bulkCreate, reorder };
