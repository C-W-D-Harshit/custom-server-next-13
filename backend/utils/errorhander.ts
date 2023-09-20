class ErrorHandler extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;

    // Error.captureStackTrace(this, this.constructor); // You can omit this line if not needed in TypeScript
    Object.setPrototypeOf(this, ErrorHandler.prototype);
  }
}

export default ErrorHandler;
