import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { ResultAsync } from "neverthrow";
import { generateTestUser, cleanupTestUser, expectUserToExist, runAsyncTest, runAsyncTestSilent } from "../test-utils";
import { signUpAction } from "@/server/auth/sign-up";

describe("Functional Authentication Tests", () => {
  let testUser: ReturnType<typeof generateTestUser>;

  beforeEach(async () => {
    testUser = generateTestUser();
    // Clean up any existing test user using functional approach
    await runAsyncTestSilent(cleanupTestUser(testUser.email));
  });

  afterEach(async () => {
    // Clean up test user using functional approach
    await runAsyncTestSilent(cleanupTestUser(testUser.email));
  });

  describe("Sign Up with Functional Paradigm", () => {
    it("should successfully sign up and verify user exists using functional approach", async () => {
      // Sign up the user
      const signUpResult = await signUpAction(testUser);
      expect(signUpResult.ok).toBe(true);

      // Use functional assertion that returns ResultAsync
      const userVerification = expectUserToExist(testUser.email).map((userData) => {
        expect(userData?.email).toBe(testUser.email);
        expect(userData?.username).toBe(testUser.username);
        expect(userData?.knumber).toBe(testUser.knumber);
        return userData;
      });

      // Run the functional assertion
      const userData = await runAsyncTest(userVerification);
      expect(userData).not.toBeNull();
    });

    it("should handle cleanup operations functionally", async () => {
      // Create a user first
      await signUpAction(testUser);

      // Verify user exists
      await runAsyncTest(expectUserToExist(testUser.email));

      // Clean up using functional approach
      const cleanupResult = cleanupTestUser(testUser.email).map(() => "Cleanup successful");

      const result = await runAsyncTestSilent(cleanupResult);
      expect(result).toBe("Cleanup successful");
    });

    it("should demonstrate error handling with functional paradigm", async () => {
      // Try to verify a non-existent user - this should handle the error gracefully
      const nonExistentEmail = "nonexistent@kcl.ac.uk";

      const verificationResult = expectUserToExist(nonExistentEmail).mapErr((error) => {
        // This is expected to fail, so we convert the error to success
        expect(error.code).toBe("ASSERTION_ERROR");
        return error;
      });

      // This should fail silently and return null
      const result = await runAsyncTestSilent(verificationResult);
      expect(result).toBeNull();
    });
  });

  describe("Functional Error Handling", () => {
    it("should handle errors gracefully in functional chains", async () => {
      const errorChain = ResultAsync.fromPromise(
        Promise.reject(new Error("Simulated error")),
        (error) => ({ message: String(error), code: "ASSERTION_ERROR" }) as const,
      )
        .mapErr((error) => {
          // Transform the error
          expect(error.message).toContain("Simulated error");
          return error;
        })
        .orElse(() => {
          // Recover from error
          return ResultAsync.fromPromise(
            Promise.resolve("Recovered from error"),
            () => ({ message: "Recovery failed", code: "ASSERTION_ERROR" }) as const,
          );
        });

      const result = await runAsyncTest(errorChain);
      expect(result).toBe("Recovered from error");
    });
  });
});
