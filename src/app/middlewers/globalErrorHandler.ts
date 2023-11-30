/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars
  next: NextFunction,
) => {
  const statusCode = 500;
  const message = err.message || 'Someting went wrong!';

  return res.status(statusCode).json({
    success: false,
    message,
    err,
  });
};

export default globalErrorHandler;