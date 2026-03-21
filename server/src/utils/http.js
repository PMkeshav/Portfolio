export function badRequest(message, errors = []) {
  const error = new Error(message);
  error.status = 400;
  error.errors = errors;
  return error;
}

export function asyncHandler(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

