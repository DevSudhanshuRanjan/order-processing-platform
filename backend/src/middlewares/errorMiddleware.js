const errorMiddleware = (
  error,
  req,
  res,
  next
) => {
  const statusCode = error.statusCode || 400;

  return res.status(statusCode).json({
    success: false,
    message: error.message || "Server Error",
  });
};

export default errorMiddleware;