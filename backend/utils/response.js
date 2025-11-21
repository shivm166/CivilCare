const STATUS_CODES = {
  // 2XX SUCCESS
  SUCCESS: 200,
  CREATED: 201,
  DELETED: 201,
  // 4XX CLIENT ERROR
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  // 5XX SERVER ERROR
  SERVER_ERROR: 500,
};

// Simplified/Stubbed COMMON_STATUS_MESSAGES for implementation purposes
const COMMON_STATUS_MESSAGES = {
  SERVER_ERROR: "Internal Server Error",
};

const sendSuccessResponse = (res, status, data = null, message, token = "") => {
  if (token) {
    return res.status(status).json({
      success: true,
      data,
      meta: {
        code: 1,
        status,
        message: String(message).trim(),
        token,
      },
    });
  } else {
    return res.status(status).json({
      success: true,
      data,
      meta: {
        code: 1,
        status,
        message: String(message).trim(),
      },
    });
  }
};

const sendSuccessResponseWithPagination = (
  res,
  status,
  data = null,
  message,
  pagination
) => {
  return res.status(status).json({
    success: true,
    data,
    meta: {
      code: 1,
      status,
      message: String(message).trim(),
      pagination,
    },
  });
};

const sendErrorResponse = (
  res,
  status = 500,
  error = null,
  message,
  data = null,
  code = 0
) => {
  // console.log('error occured : ', error); // console.log removed from final output
  return res.status(status).json({
    success: false,
    data: data,
    meta: {
      code: code,
      status,
      message: message
        ? String(message).trim()
        : COMMON_STATUS_MESSAGES.SERVER_ERROR,
    },
  });
};

const sendGlobalError = ({ statusCode, message }) => {
  const error = new Error(message);
  error.statusCode = statusCode || 500;
  throw error;
};

const buildPagination = (totalItems, limit, currentPage) => {
  const limitNum = Number(limit) || 10;
  const pageNum = Number(currentPage) || 1;

  const totalPages = Math.ceil(totalItems / limitNum);

  return {
    currentPage: pageNum,
    totalPages,
    totalItems,
    hasNextPage: pageNum < totalPages,
    hasPrevPage: pageNum > 1,
    limit: limitNum,
  };
};

export {
  sendErrorResponse,
  sendGlobalError,
  sendSuccessResponse,
  sendSuccessResponseWithPagination,
  buildPagination,
  STATUS_CODES,
};
