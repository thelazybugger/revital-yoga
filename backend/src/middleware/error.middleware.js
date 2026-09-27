export const errorHandler = (err, req, res, next) => {
  console.error(
    `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`,
    err,
  );

  if (err.name === "ZodError") {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  if (err.code === "P2002") {
    return res.status(409).json({
      success: false,
      message: "A record with the same unique value already exists.",
    });
  }

  if (err.code === "P2025") {
    return res.status(404).json({
      success: false,
      message: "Requested record was not found.",
    });
  }

  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message:
      statusCode >= 500
        ? "Internal server error"
        : err.message || "Request failed",
  });
};
