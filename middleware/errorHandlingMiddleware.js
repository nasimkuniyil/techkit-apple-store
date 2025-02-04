const errorHandler = (err, req, res, next) => {
  console.log("!!! ERROR HANDLER MIDDLEWARE !!!");
  console.log(err.message)
  const statusCode = err.status || 500; // Default to 500 if status code is not set
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    status: statusCode,
  });
};

module.exports = errorHandler;

// stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
// show stack only in development
