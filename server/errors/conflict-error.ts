import CustomError from "./custom-error";

export default class ConflictError extends CustomError {
  statusCode = 409;

  constructor(message: string = "Conflict") {
    super(message);

    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}
