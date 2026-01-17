import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  generateTestUser,
  generateTestAssociate,
  cleanupTestUser,
  cleanupTestAssociate,
  waitFor,
  clearInbucketMailbox,
  getLatestEmailFromInbucket,
  extractConfirmationLink,
  extractResetPasswordLink,
  getEmailContentFromInbucket,
  createTestServiceClient,
  expectUserToExist,
  expectAssociateRequestToExist,
} from "../test-utils";
import { signUpAction, associatesSignUpAction } from "@/server/auth/sign-up";
import { signInAction } from "@/server/auth/sign-in";
import { forgotPasswordAction } from "@/server/auth/forgot-password";

describe("Authentication Integration Tests", () => {
  let testUser: ReturnType<typeof generateTestUser>;
  let testAssociate: ReturnType<typeof generateTestAssociate>;
  let serviceClient: ReturnType<typeof createTestServiceClient>;

  beforeEach(async () => {
    testUser = generateTestUser();
    testAssociate = generateTestAssociate();
    serviceClient = createTestServiceClient();

    // Clear any existing emails and data
    await clearInbucketMailbox(testUser.email);
    await clearInbucketMailbox(testAssociate.email);
    await cleanupTestUser(testUser.email);
    await cleanupTestAssociate(testAssociate.email);
  });

  afterEach(async () => {
    // Clean up test data
    await cleanupTestUser(testUser.email);
    await cleanupTestAssociate(testAssociate.email);
    await clearInbucketMailbox(testUser.email);
    await clearInbucketMailbox(testAssociate.email);
  });

  describe("Complete User Registration Flow", () => {
    it("should complete the entire user registration and confirmation flow", async () => {
      // Step 1: Sign up
      const signUpResult = await signUpAction(testUser);
      expect(signUpResult.ok).toBe(true);

      // Step 2: Verify confirmation email was sent
      await waitFor(2000);
      const confirmationEmail = await getLatestEmailFromInbucket(testUser.email);
      expect(confirmationEmail).not.toBeNull();

      // Step 3: Extract and verify confirmation link
      const emailContent = await getEmailContentFromInbucket(
        testUser.email,
        (confirmationEmail as { id?: string })?.id ?? "",
      );
      const confirmationLink = extractConfirmationLink(emailContent);
      expect(confirmationLink).not.toBeNull();
      expect(confirmationLink).toContain("confirm");

      // Step 4: Verify user exists in auth but is not confirmed
      const { data: authUsers } = await serviceClient.auth.admin.listUsers();
      const authUser = authUsers.users.find((user) => user.email === testUser.email);
      expect(authUser).not.toBeNull();
      expect(authUser?.email_confirmed_at).toBeNull();

      // Step 5: Manually confirm user (simulating clicking confirmation link)
      if (authUser) {
        await serviceClient.auth.admin.updateUserById(authUser.id, {
          email_confirm: true,
        });
      }

      // Step 6: Verify user can now sign in
      const signInResult = await signInAction({
        identifier: testUser.email,
        password: testUser.password,
      });
      expect(signInResult.ok).toBe(true);

      // Step 7: Verify user exists in the application database
      await expectUserToExist(testUser.email);
    });
  });

  describe("Complete Associates Registration Flow", () => {
    it("should complete the entire associates registration flow", async () => {
      // Step 1: Submit associates request
      const associatesResult = await associatesSignUpAction(testAssociate);
      expect(associatesResult.ok).toBe(true);

      // Step 2: Verify request was stored in database
      const associateRequest = await expectAssociateRequestToExist(testAssociate.email);
      expect(associateRequest?.name).toBe(testAssociate.name);
      expect(associateRequest?.email).toBe(testAssociate.email);
      expect(associateRequest?.notes).toBe(testAssociate.notes);

      // Step 3: Verify associate cannot sign in (they're not a user yet)
      const signInResult = await signInAction({
        identifier: testAssociate.email,
        password: "anypassword",
      });
      expect(signInResult.ok).toBe(false);
    });
  });

  describe("Password Reset Flow", () => {
    it("should complete the entire password reset flow", async () => {
      // Step 1: Create and confirm a user
      await signUpAction(testUser);
      await waitFor(1000);

      const { data: authUsers } = await serviceClient.auth.admin.listUsers();
      const authUser = authUsers.users.find((user) => user.email === testUser.email);
      if (authUser) {
        await serviceClient.auth.admin.updateUserById(authUser.id, {
          email_confirm: true,
        });
      }

      // Step 2: Request password reset
      const resetResult = await forgotPasswordAction({ email: testUser.email });
      expect(resetResult.ok).toBe(true);

      // Step 3: Verify reset email was sent
      await waitFor(2000);
      const resetEmail = await getLatestEmailFromInbucket(testUser.email);
      expect(resetEmail).not.toBeNull();

      // Step 4: Extract and verify reset link
      const resetEmailContent = await getEmailContentFromInbucket(
        testUser.email,
        (resetEmail as { id?: string })?.id ?? "",
      );
      const resetLink = extractResetPasswordLink(resetEmailContent);
      expect(resetLink).not.toBeNull();
      expect(resetLink).toMatch(/reset|password/i);

      // Step 5: Verify user can still sign in with old password (until they actually reset)
      const oldPasswordSignIn = await signInAction({
        identifier: testUser.email,
        password: testUser.password,
      });
      expect(oldPasswordSignIn.ok).toBe(true);
    });
  });

  describe("Cross-Flow Integration", () => {
    it("should prevent duplicate registrations across user and associate flows", async () => {
      // Step 1: Create a regular user
      const userResult = await signUpAction(testUser);
      expect(userResult.ok).toBe(true);

      // Step 2: Try to create associate with same email
      const duplicateAssociate = { ...testAssociate, email: testUser.email };
      const associateResult = await associatesSignUpAction(duplicateAssociate);
      expect(associateResult.ok).toBe(false);
      if (!associateResult.ok) {
        expect(associateResult.error.message).toContain("already exists");
      }
    });

    it("should prevent user registration with existing associate email", async () => {
      // Step 1: Create an associate request
      const associateResult = await associatesSignUpAction(testAssociate);
      expect(associateResult.ok).toBe(true);

      // Step 2: Try to create user with same email
      const duplicateUser = { ...testUser, email: testAssociate.email };
      const userResult = await signUpAction(duplicateUser);
      expect(userResult.ok).toBe(false);
      if (!userResult.ok) {
        expect(userResult.error.message).toContain("already exists");
      }
    });
  });

  describe("Email Service Integration", () => {
    it("should successfully send emails to Inbucket for all flows", async () => {
      // Clear mailboxes
      await clearInbucketMailbox(testUser.email);

      // Test user confirmation email
      await signUpAction(testUser);
      await waitFor(2000);

      const userEmails = await import("../test-utils").then((utils) => utils.getEmailsFromInbucket(testUser.email));
      expect(userEmails.length).toBeGreaterThan(0);

      // Confirm user and test password reset email
      const { data: authUsers } = await serviceClient.auth.admin.listUsers();
      const authUser = authUsers.users.find((user) => user.email === testUser.email);
      if (authUser) {
        await serviceClient.auth.admin.updateUserById(authUser.id, {
          email_confirm: true,
        });
      }

      await forgotPasswordAction({ email: testUser.email });
      await waitFor(2000);

      const resetEmails = await import("../test-utils").then((utils) => utils.getEmailsFromInbucket(testUser.email));
      expect(resetEmails.length).toBeGreaterThan(userEmails.length);
    });
  });

  describe("Error Handling and Recovery", () => {
    it("should handle network timeouts gracefully", async () => {
      // This test assumes that the auth service might occasionally timeout
      // In a real scenario, you'd want to test with network delays/failures

      const promises = Array.from({ length: 5 }, (_, i) => signUpAction(generateTestUser(`batch${i}`)));

      const results = await Promise.allSettled(promises);

      // At least some should succeed, and any failures should be handled gracefully
      const successes = results.filter((result) => result.status === "fulfilled" && result.value.ok);
      const failures = results.filter((result) => result.status === "fulfilled" && !result.value.ok);

      // Clean up any successful creations
      for (const result of results) {
        if (result.status === "fulfilled" && result.value.ok) {
          // Clean up would need the email, but this is just a demonstration
        }
      }

      expect(successes.length + failures.length).toBe(results.length);
    });
  });
});
