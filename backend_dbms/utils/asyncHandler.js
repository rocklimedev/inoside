"use strict";

/**
 * Wraps an async route handler and forwards any thrown error to Express's
 * next(err) — which is picked up by the global error middleware.
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
