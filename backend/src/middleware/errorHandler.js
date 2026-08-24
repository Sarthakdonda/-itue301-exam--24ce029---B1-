function errorHandler(error, req, res, next) {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal server error";
  let details = error.details;

  if (error.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
    details = Object.values(error.errors).map((item) => ({
      field: item.path,
      message: item.message,
    }));
  }

  if (error.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${error.path}`;
  }

  if (error.code === 11000) {
    statusCode = 400;
    const field = Object.keys(error.keyValue || {})[0] || "field";
    message = `${field} must be unique`;
  }

  if (statusCode >= 500) {
    console.error(error);
  }

  const payload = {
    success: false,
    error: {
      message,
    },
  };

  if (details) {
    payload.error.details = details;
  }

  res.status(statusCode).json(payload);
}

module.exports = errorHandler;
