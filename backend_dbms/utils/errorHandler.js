"use strict";

const { StatusCodes } = require("http-status-codes");

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  console.error("[ERROR]", err.message, err.stack);

  // Sequelize validation errors
  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Validation error",
      errors: err.errors.map((e) => ({ field: e.path, message: e.message })),
    });
  }

  // Sequelize FK errors
  if (err.name === "SequelizeForeignKeyConstraintError") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Foreign key constraint error — related resource not found",
    });
  }

  const statusCode = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
  });
};
