const MESSAGES = {
  SUCCESS: "Operation successful!",
  ERROR: "Something went wrong, please try again.",
  USER_NOT_FOUND: "User not found.",
  NOT_FOUND:"Requested resource not found",
  INVALID_INPUT: "Invalid input provided.",
  MISSING_FIELDS: "Required field(s) missing.",
  UNAUTHORIZED: "You are not authorized to access this resource.",
  ALREADY_EXISTS: "Resource already exists.",
};

const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    CONFLICT: 409,
  };

  
  module.exports = {MESSAGES, HTTP_STATUS};