const errorMiddleware = (
  error,
  req,
  res,
  next
) => {
  const statusCode = error.statusCode || 500;

  // Log server errors
  if (statusCode >= 500) {
    console.error("Server Error:", error.message, error.stack);
  }

  // In production, don't leak internal error details
  const message =
    statusCode >= 500 && process.env.NODE_ENV === "production"
      ? "Internal Server Error"
      : error.message || "Server Error";

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorMiddleware;