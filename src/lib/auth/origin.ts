import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { headers } from "next/headers";

type GetOriginError = {
  message: string;
  code: "GET_ORIGIN_ERROR";
}

export function getOrigin() {
  return ResultAsync.fromPromise(headers(), () => ({
    message: "Failed to get headers.",
    code: "GET_ORIGIN_ERROR",
  } as GetOriginError)).andThen((headers) => {
    const origin = headers.get("origin");
    if (!origin) {
      return errAsync({
        message: "Origin header not found.",
        code: "GET_ORIGIN_ERROR",
      } as GetOriginError);
    }
    return okAsync(origin);
  });
}