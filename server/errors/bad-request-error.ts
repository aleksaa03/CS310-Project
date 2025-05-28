import CustomError from "./custom-error";

export default class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(message: string = "Bad request.") {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}
