"use strict";

const asyncHandler = require("../utils/asyncHandler");
const response = require("../utils/response");
const unitSvc = require("../services/UnitService");

const list = asyncHandler(async (req, res) =>
  response.success(res, await unitSvc.list()),
);
const show = asyncHandler(async (req, res) =>
  response.success(res, await unitSvc.findById(req.params.id)),
);
const create = asyncHandler(async (req, res) =>
  response.created(res, await unitSvc.createUnit(req.body), "Unit created"),
);
const update = asyncHandler(async (req, res) =>
  response.success(
    res,
    await unitSvc.updateUnit(req.params.id, req.body),
    "Unit updated",
  ),
);
const remove = asyncHandler(async (req, res) => {
  await unitSvc.deleteUnit(req.params.id);
  return response.noContent(res);
});

module.exports = { list, show, create, update, remove };
