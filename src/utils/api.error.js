/**
 * @fileoverview Custom API Error Class for structured error handling.
 */

/**
 * Custom error class for API-related errors.
 * It extends the native JavaScript Error class to include
 * additional properties like status code, a list of errors,
 * and a success flag. This provides a consistent way to
 * handle and respond to errors across the application.
 * * @class
 * @augments Error
 */
class ApiError extends Error {
  /**
   * Creates an instance of ApiError.
   * @param {number} statusCode - The HTTP status code of the error.
   * @param {string} message - A human-readable error message.
   * @param {Array<string>} [errors=[]] - An array of specific error details.
   * @param {string} [stack=""] - The stack trace of the error.
   */
  constructor(statusCode, message = 'Something went wrong', errors = [], stack = "") {
    // Call the parent class constructor with the error message.
    super(message);

    // Set the HTTP status code for the response.
    this.statusCode = statusCode;
    this.msg= message;//added by me
    // A flag to indicate a failed operation.
    this.success = false;

    // An array to hold specific error messages, useful for validation errors.
    this.errors = errors;

    // If a stack trace is provided, use it. Otherwise, capture the current stack.
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// Export the class for use in other modules.
export { ApiError };

