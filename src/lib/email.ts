import { errAsync, fromSafePromise, okAsync, ResultAsync } from "neverthrow";

import { getOrigin } from "./origin";
import { createServiceClient } from "@/utils/supabase/server";

export const sendNewAssociatesSignUpRequestToAdmin = ({ id }: { id: string }) => okAsync(id);

export const sendAssociatesRequestApprovedEmail = ({ email, name, id }: { email: string; name: string; id: string }) =>
  ResultAsync.combine([createServiceClient(), getOrigin()])
    .andThen(([supabase, origin]) =>
      fromSafePromise(
        supabase.auth.admin.inviteUserByEmail(email, {
          data: {
            name,
            siteUrl: origin,
            email,
            requestId: id,
          },
        }),
      ),
    )
    .andThen((response) =>
      response.error
        ? errAsync({ code: "SEND_EMAIL_ERROR", message: response.error.message } as SendEmailError)
        : okAsync(response.data),
    );

type SendEmailError = {
  code: "SEND_EMAIL_ERROR";
  message: string;
};
