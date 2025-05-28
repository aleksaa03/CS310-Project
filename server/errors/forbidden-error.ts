import CustomError from "./custom-error";

export default class ForbiddenError extends CustomError {
  statusCode = 403;

  constructor(message: string = "Forbidden.") {
    super(message);

    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}
