export function tryCatch<T>(fn: () => T): T | null {
  try {
    return fn();
  } catch (error) {
    console.error("Error occurred:", error);
    return null;
  }
}

export async function tryCatchAsync<T>(
  fn: () => Promise<T>
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    console.error("Error occurred:", error);
    return null;
  }
}

export function tryCatchWithReturn<T, R>(fn: () => T, returnValue: R): T | R {
  try {
    return fn();
  } catch (error) {
    console.error("Error occurred:", error);
    return returnValue;
  }
}

export async function tryCatchWithReturnAsync<T, R>(
  fn: () => Promise<T>,
  returnValue: R
): Promise<T | R> {
  try {
    return await fn();
  } catch (error) {
    console.error("Error occurred:", error);
    return returnValue;
  }
}
