import { createClient as supaCreateClient } from "@supabase/supabase-js";
import { expect } from "vitest";
import { ResultAsync, fromSafePromise, errAsync } from "neverthrow";
import { env } from "@/env";
import { type Database } from "@/types/database.types";
import { runServiceQuery } from "@/utils/supabase-run";

type TestError = {
  message: string;
  code: "CLEANUP_ERROR" | "FETCH_ERROR" | "EMAIL_ERROR" | "ASSERTION_ERROR";
};

// Create a service client for test setup/teardown operations
export const createTestServiceClient = () =>
  supaCreateClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

// Create a public client for testing user operations
export const createTestPublicClient = () =>
  supaCreateClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

// Generate unique test data
export const generateTestUser = (suffix = Date.now().toString()) => ({
  email: `test-${suffix}@kcl.ac.uk`,
  username: `testuser${suffix}`,
  knumber: `K${suffix.slice(-8).padStart(8, "0")}`,
  password: "TestPassword123!",
  name: `Test User ${suffix}`,
});

export const generateTestAssociate = (suffix = Date.now().toString()) => ({
  email: `associate-${suffix}@example.com`,
  name: `Test Associate ${suffix}`,
  notes: `Test notes for associate ${suffix}`,
});

// Clean up test users using functional programming
export const cleanupTestUser = (email: string) =>
  runServiceQuery((supabase) => supabase.from("users").select("auth_user_uuid").eq("email", email).single())
    .mapErr(() => ({ message: "Failed to query user for cleanup", code: "CLEANUP_ERROR" }) as TestError)
    .andThen((userData) => {
      if (userData?.auth_user_uuid) {
        return ResultAsync.fromPromise(
          Promise.resolve(createTestServiceClient()),
          () => ({ message: "Failed to create service client", code: "CLEANUP_ERROR" }) as TestError,
        ).andThen((serviceClient) =>
          fromSafePromise(serviceClient.auth.admin.deleteUser(userData.auth_user_uuid))
            .mapErr(() => ({ message: "Failed to delete auth user", code: "CLEANUP_ERROR" }) as TestError)
            .andThen(() =>
              runServiceQuery((supabase) => supabase.from("users").delete().eq("email", email)).mapErr(
                () => ({ message: "Failed to delete user record", code: "CLEANUP_ERROR" }) as TestError,
              ),
            ),
        );
      }
      return runServiceQuery((supabase) => supabase.from("users").delete().eq("email", email)).mapErr(
        () => ({ message: "Failed to delete user record", code: "CLEANUP_ERROR" }) as TestError,
      );
    })
    .mapErr((error) => {
      console.warn(`Failed to cleanup test user ${email}:`, error);
      return error;
    });

// Clean up test associate requests using functional programming
export const cleanupTestAssociate = (email: string) =>
  runServiceQuery((supabase) => supabase.from("associates_requests").delete().eq("email", email)).mapErr((error) => {
    console.warn(`Failed to cleanup test associate ${email}:`, error);
    return { message: "Failed to delete associate request", code: "CLEANUP_ERROR" } as TestError;
  });

// Helper to wait for async operations
export const waitFor = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Inbucket email helpers using functional programming
export const getEmailsFromInbucket = (email: string) => {
  const inbucketUrl = process.env.INBUCKET_URL ?? "http://127.0.0.1:54324";
  const mailbox = email.split("@")[0]; // Extract username part

  return ResultAsync.fromPromise(
    fetch(`${inbucketUrl}/api/v1/mailbox/${mailbox}`),
    () => ({ message: `Failed to fetch emails from Inbucket for ${email}`, code: "FETCH_ERROR" }) as TestError,
  ).andThen((response) =>
    response.ok
      ? ResultAsync.fromPromise(
          response.json(),
          () => ({ message: "Failed to parse email response", code: "FETCH_ERROR" }) as TestError,
        )
      : errAsync({ message: `HTTP error: ${response.status}`, code: "FETCH_ERROR" } as TestError),
  );
};

export const getLatestEmailFromInbucket = (email: string) =>
  getEmailsFromInbucket(email)
    .map((emails: unknown[]) => (emails.length > 0 ? emails[0] : null))
    .mapErr((error) => {
      console.warn(`Failed to get latest email for ${email}:`, error);
      return error;
    });

export const getEmailContentFromInbucket = (email: string, messageId: string) => {
  const inbucketUrl = process.env.INBUCKET_URL ?? "http://127.0.0.1:54324";
  const mailbox = email.split("@")[0];

  return ResultAsync.fromPromise(
    fetch(`${inbucketUrl}/api/v1/mailbox/${mailbox}/${messageId}`),
    () => ({ message: "Failed to fetch email content from Inbucket", code: "FETCH_ERROR" }) as TestError,
  ).andThen((response) =>
    response.ok
      ? ResultAsync.fromPromise(
          response.json(),
          () => ({ message: "Failed to parse email content", code: "FETCH_ERROR" }) as TestError,
        )
      : errAsync({ message: `HTTP error: ${response.status}`, code: "FETCH_ERROR" } as TestError),
  );
};

// Helper to clear all emails from an Inbucket mailbox
export const clearInbucketMailbox = (email: string) => {
  const inbucketUrl = process.env.INBUCKET_URL ?? "http://127.0.0.1:54324";
  const mailbox = email.split("@")[0];

  return ResultAsync.fromPromise(
    fetch(`${inbucketUrl}/api/v1/mailbox/${mailbox}`, { method: "DELETE" }),
    () => ({ message: `Failed to clear Inbucket mailbox for ${email}`, code: "EMAIL_ERROR" }) as TestError,
  ).mapErr((error) => {
    console.warn(`Failed to clear Inbucket mailbox for ${email}:`, error);
    return error;
  });
};

// Helper to extract confirmation link from email content
export const extractConfirmationLink = (emailContent: { body?: { html?: string } }): string | null => {
  if (!emailContent?.body?.html) {
    return null;
  }

  const htmlContent = emailContent.body.html;
  const linkMatch = htmlContent.match(/href="([^"]*confirm[^"]*)"/i);
  return linkMatch ? linkMatch[1] : null;
};

// Helper to extract reset password link from email content
export const extractResetPasswordLink = (emailContent: { body?: { html?: string } }): string | null => {
  if (!emailContent?.body?.html) {
    return null;
  }

  const htmlContent = emailContent.body.html;
  const linkMatch = htmlContent.match(/href="([^"]*reset[^"]*)"/i);
  return linkMatch ? linkMatch[1] : null;
};

// Assert helpers using functional programming for better test readability
export const expectUserToExist = (email: string) =>
  runServiceQuery((supabase) => supabase.from("users").select("*").eq("email", email).single())
    .mapErr(() => ({ message: "Failed to query user", code: "ASSERTION_ERROR" }) as TestError)
    .map((userData) => {
      expect(userData).not.toBeNull();
      return userData;
    });

export const expectUserNotToExist = (email: string) =>
  runServiceQuery((supabase) => supabase.from("users").select("*").eq("email", email).single())
    .mapErr(() => ({ message: "Expected error when user doesn't exist", code: "ASSERTION_ERROR" }) as TestError)
    .map((result) => {
      expect(result).toBeNull();
      return result;
    });

export const expectAssociateRequestToExist = (email: string) =>
  runServiceQuery((supabase) => supabase.from("associates_requests").select("*").eq("email", email).single())
    .mapErr(() => ({ message: "Failed to query associate request", code: "ASSERTION_ERROR" }) as TestError)
    .map((requestData) => {
      expect(requestData).not.toBeNull();
      return requestData;
    });

// Convenience functions to bridge between Promise and ResultAsync worlds for testing
export const runAsyncTest = async <T>(resultAsync: ResultAsync<T, TestError>): Promise<T> => {
  const result = await resultAsync;
  if (result.isErr()) {
    throw new Error(`Test operation failed: ${result.error.message}`);
  }
  return result.value;
};

export const runAsyncTestSilent = async <T>(resultAsync: ResultAsync<T, TestError>): Promise<T | null> => {
  const result = await resultAsync;
  return result.isOk() ? result.value : null;
};

// Async versions of functions that return promises for backward compatibility
export const cleanupTestUserAsync = async (email: string): Promise<void> => {
  await runAsyncTestSilent(cleanupTestUser(email));
};

export const cleanupTestAssociateAsync = async (email: string): Promise<void> => {
  await runAsyncTestSilent(cleanupTestAssociate(email));
};

export const getEmailsFromInbucketAsync = async (email: string): Promise<unknown[]> => {
  const result = await runAsyncTestSilent(getEmailsFromInbucket(email));
  return result ?? [];
};

export const getLatestEmailFromInbucketAsync = async (email: string): Promise<unknown | null> => {
  return await runAsyncTestSilent(getLatestEmailFromInbucket(email));
};

export const getEmailContentFromInbucketAsync = async (email: string, messageId: string): Promise<unknown | null> => {
  return await runAsyncTestSilent(getEmailContentFromInbucket(email, messageId));
};

export const clearInbucketMailboxAsync = async (email: string): Promise<void> => {
  await runAsyncTestSilent(clearInbucketMailbox(email));
};

export const expectUserToExistAsync = async (email: string) => {
  return await runAsyncTest(expectUserToExist(email));
};

export const expectAssociateRequestToExistAsync = async (email: string) => {
  return await runAsyncTest(expectAssociateRequestToExist(email));
};
