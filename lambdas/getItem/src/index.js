export const handler = async (event) => {
  // TODO: check autorization? With a lambda auth from api gateway maybe??

  return {
    statusCode: 200,
    body: 'todo',
  }
}
