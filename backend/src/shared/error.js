export function notFoundHandler(req, res, _next) {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Resource not found',
      path: req.originalUrl
    }
  });
}

export function errorHandler(err, req, res, _next) {
  const status = err.status || 500;
  const isDev = process.env.NODE_ENV === 'development';
  const payload = {
    success: false,
    error: {
      code: err.code || (status === 500 ? 'INTERNAL_SERVER_ERROR' : 'ERROR'),
      message: err.message || 'Internal Server Error'
    }
  };
  if (err.details) {
    payload.error.details = err.details;
  }
  if (isDev && err.stack) {
    payload.error.stack = err.stack;
  }
  res.status(status).json(payload);
}


