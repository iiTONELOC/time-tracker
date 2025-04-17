import {
  sha256Hash,
  getKeyFromPassword,
  encryptDataWithKey,
  decryptDataWithKey,
  generateRandomBytes,
} from "../../utils";
import { updateEvents } from "../data";
import { batch, effect, signal } from "@preact/signals";
import { setSessionKey, withSessionKey } from "./session";
import { tryCatchAsync } from "../../utils/errorHandling";

const MIN_PASSWORD_LENGTH = 15;

const password = signal<string>("");
export const passwordSet = signal<boolean>(false); // no setter, updated via effect
export const isAuthenticated = signal<boolean>(false);
const sessionSalt = signal<Uint8Array<ArrayBufferLike>>(
  generateRandomBytes(16)
);
/* setters */

export const setPassword = async (pass: string): Promise<boolean> => {
  generateRandomBytes(16);
  const newSessionKey = await getKeyFromPassword(pass, sessionSalt.value);
  setSessionKey(newSessionKey);
  const passHash = await sha256Hash(pass);
  password.value = await encryptDataWithKey(
    pass,
    newSessionKey,
    sessionSalt.value
  );
  localStorage.setItem("passHash", passHash);
  setIsAuthenticated(true);
  passwordSet.value = true;
  return true;
};

export const getPassword = async () => {
  if (password.peek() == "" || !isAuthenticated.peek()) return "";
  return await withSessionKey(async (key: CryptoKey) => {
    return await decryptDataWithKey(password.peek(), key);
  });
};

export const setIsAuthenticated = (isAuth: boolean) =>
  (isAuthenticated.value = isAuth);

export const clearCredentials = () => {
  batch(() => {
    password.value = "";
    setSessionKey({} as CryptoKey);
    isAuthenticated.value = false;
  });
};

export const doPasswordsMatch = async (pass: string) =>
  (await sha256Hash(pass)) == password.peek();

/*effects*/

// update the passwordSet when password changes
effect(() => {
  batch(() => {
    passwordSet.value =
      password.value != "" && password.value.length >= MIN_PASSWORD_LENGTH;

    updateEvents.value = isAuthenticated.value;
  });
});

/*helpers*/

export async function enforcePassword<T>(fn: () => Promise<T>): Promise<T> {
  let warned = false;
  while (!passwordSet) {
    // do nothing for now
    if (!warned) {
      console.warn("Password needs to be set!");
      warned = true;
    }
  }
  return await fn();
}

export async function checkPassAndCatchErrs<T>(
  fn: () => Promise<T>
): Promise<T | null> {
  return await enforcePassword(async () => await tryCatchAsync(fn));
}

export async function withEncryptedPass<T>(
  fn: (encryptedPass: string) => Promise<T>
): Promise<T> {
  if (password.value == "" || !isAuthenticated.value) {
    console.warn("User is not authenticated!");
    Promise.reject(new Error("User is not authenticated!"));
  }

  return await fn(password.value);
}
