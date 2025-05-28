import { NextFunction, Request } from "express";
import CustomError from "../errors/custom-error";

const errorHandler = (err: Error, req: Request, res: any, next: NextFunction) => {
  console.log(`${err.message} - ${err.stack}`);

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  return res.status(500).json({ message: "Internal server error" });
};

export { errorHandler };
