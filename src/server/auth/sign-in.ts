"use server";

import { Cause, Data, Effect, Either } from "effect";
import { z } from "zod";

import { emailSchema, kNumberSchema, signInFormSchema, usernameSchema } from "@/config/auth-schemas";
import { createClientEffect, run, Supabase, type SBC } from "@/utils/supabase/server";
import { parseSchemaEffect } from "@/utils/parse-schema";

export const signInAction = async (values: z.infer<typeof signInFormSchema>) => {
  const runnable = Effect.provideService(signIn(values), Supabase, {
    createClient: createClientEffect,
  }).pipe(
    Effect.matchCauseEffect({
      onSuccess: () => Effect.succeed({ _tag: "Success" as const }),
      onFailure: (cause) => Effect.succeed({ _tag: "Failure" as const, value: Cause.prettyErrors(cause) }),
    }),
  );

  return Effect.runPromise(runnable);
};

class InvalidIdentifierError extends Data.TaggedError("InvalidIdentifierError")<{
  message: string;
}> {}

class SignInErrorEffect extends Data.TaggedError("SignInError")<{
  message: string;
}> {}

const signIn = (values: z.infer<typeof signInFormSchema>) =>
  Effect.gen(function* () {
    const parsed = yield* parseSchemaEffect(signInFormSchema, values);

    const supabase = yield* Supabase;
    const client = yield* supabase.createClient;

    const email = yield* Effect.either(parseSchemaEffect(emailSchema, parsed.identifier));
    if (Either.isRight(email)) {
      return yield* signInWithEmailEffect(email.right, parsed.password, client);
    }

    const knumber = yield* Effect.either(parseSchemaEffect(kNumberSchema, parsed.identifier));
    if (Either.isRight(knumber)) {
      return yield* signInWithKNumberEffect(knumber.right, parsed.password, client);
    }

    const username = yield* Effect.either(parseSchemaEffect(usernameSchema, parsed.identifier));
    if (Either.isRight(username)) {
      return yield* signInWithUsernameEffect(username.right, parsed.password, client);
    }

    return yield* new InvalidIdentifierError({
      message: "Identifier must be a valid email, K-Number, or username.",
    });
  });

const signInWithEmailEffect = (email: string, password: string, client: SBC) =>
  Effect.gen(function* () {
    const { error, data } = yield* Effect.promise(() =>
      client.auth.signInWithPassword({
        email,
        password,
      }),
    );

    return error
      ? yield* new SignInErrorEffect({
          message: "Failed to sign in.",
        })
      : data;
  });

const signInWithKNumberEffect = (knumber: string, password: string, client: SBC) =>
  Effect.gen(function* () {
    const data = yield* run(
      () => client.from("users").select("email").eq("knumber", knumber).single(),
      () =>
        new SignInErrorEffect({
          message: "Failed to retrieve email for K-Number.",
        }),
    );

    return yield* signInWithEmailEffect(data.email, password, client);
  });

const signInWithUsernameEffect = (username: string, password: string, client: SBC) =>
  Effect.gen(function* () {
    const data = yield* run(
      () => client.from("users").select("email").eq("username", username).single(),
      () =>
        new SignInErrorEffect({
          message: "Failed to retrieve email for username.",
        }),
    );

    return yield* signInWithEmailEffect(data.email, password, client);
  });
