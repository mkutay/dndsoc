import { errAsync, fromPromise, okAsync } from "neverthrow";
import { headers } from "next/headers";

type GetOriginError = {
  message: string;
  code: "GET_ORIGIN_ERROR";
};

export const getOrigin = () =>
  fromPromise(
    headers(),
    () =>
      ({
        message: "Failed to get headers.",
        code: "GET_ORIGIN_ERROR",
      }) as GetOriginError,
  ).andThen((headers) => {
    const origin = headers.get("origin");
    return origin
      ? okAsync(origin)
      : errAsync({
          message: "Origin header not found.",
          code: "GET_ORIGIN_ERROR",
        } as GetOriginError);
  });
