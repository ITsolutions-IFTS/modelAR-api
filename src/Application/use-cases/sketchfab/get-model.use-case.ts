type GetModelHandler = (uid: string, apiKey: string) => Promise<unknown>;

export async function getModelUseCase(
  uid: string,
  handler: GetModelHandler,
  apiKey: string,
): Promise<unknown> {
  return handler(uid, apiKey);
}
