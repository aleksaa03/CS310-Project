import CustomError from "./custom-error";

export default class NotAuthorizedError extends CustomError {
  statusCode = 401;

  constructor(message: string = "Not authorized.") {
    super(message);

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }
}
