"use strict";

const { StatusCodes } = require("http-status-codes");

const success = (
  res,
  data = {},
  message = "Success",
  statusCode = StatusCodes.OK,
) => res.status(statusCode).json({ success: true, message, data });

const created = (res, data = {}, message = "Created") =>
  success(res, data, message, StatusCodes.CREATED);

const noContent = (res) => res.status(StatusCodes.NO_CONTENT).send();

const error = (
  res,
  message = "Something went wrong",
  statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
  errors = null,
) =>
  res
    .status(statusCode)
    .json({ success: false, message, ...(errors && { errors }) });

const notFound = (res, message = "Resource not found") =>
  error(res, message, StatusCodes.NOT_FOUND);

const badRequest = (res, message = "Bad request", errors = null) =>
  error(res, message, StatusCodes.BAD_REQUEST, errors);

module.exports = { success, created, noContent, error, notFound, badRequest };
