export const createError = (message, code, statusCode = 400) => {
  const error = new Error(message)
  error.code = code
  error.statusCode = statusCode

  console.trace(error)

  return {
    statusCode,
    body: JSON.stringify({
      code,
      message,
    }),
  }
}
