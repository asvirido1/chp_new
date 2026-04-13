export * from "./generated/api";
export * from "./generated/api.schemas";
export {
  setBaseUrl,
  setAuthTokenGetter,
  setAdminSecretGetter,
} from "./custom-fetch";
export type { AuthTokenGetter, AdminSecretGetter } from "./custom-fetch";
