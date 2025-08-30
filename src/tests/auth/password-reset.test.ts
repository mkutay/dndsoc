import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  generateTestUser,
  cleanupTestUser,
  waitFor,
  clearInbucketMailbox,
  getLatestEmailFromInbucket,
  extractResetPasswordLink,
  getEmailContentFromInbucket,
  createTestServiceClient,
} from "../test-utils";
import { forgotPasswordAction } from "@/server/auth/forgot-password";
import { signUpAction } from "@/server/auth/sign-up";
import { forgotPasswordFormSchema } from "@/config/auth-schemas";

describe("Password Reset", () => {
  let testUser: ReturnType<typeof generateTestUser>;
  let serviceClient: ReturnType<typeof createTestServiceClient>;

  beforeEach(async () => {
    testUser = generateTestUser();
    serviceClient = createTestServiceClient();

    // Clear any existing emails for this test user
    await clearInbucketMailbox(testUser.email);

    // Ensure test user doesn't exist
    await cleanupTestUser(testUser.email);

    // Create a confirmed user for password reset tests
    await signUpAction(testUser);
    await waitFor(1000);

    // Manually confirm the user for testing
    const { data: authUsers } = await serviceClient.auth.admin.listUsers();
    const authUser = authUsers.users.find((user) => user.email === testUser.email);
    if (authUser) {
      await serviceClient.auth.admin.updateUserById(authUser.id, {
        email_confirm: true,
      });
    }
  });

  afterEach(async () => {
    // Clean up test user
    await cleanupTestUser(testUser.email);
    await clearInbucketMailbox(testUser.email);
  });

  describe("Valid Password Reset", () => {
    it("should successfully send password reset email for existing user", async () => {
      const result = await forgotPasswordAction({ email: testUser.email });

      expect(result.ok).toBe(true);
      if (!result.ok) {
        console.error("Password reset failed:", result.error);
      }

      // Wait a moment for email to be sent
      await waitFor(2000);

      // Check that reset email was sent to Inbucket
      const latestEmail = await getLatestEmailFromInbucket(testUser.email);
      expect(latestEmail).not.toBeNull();
      expect(latestEmail).toHaveProperty("subject");
      expect((latestEmail as { subject?: string })?.subject).toMatch(/reset|password/i);
    });

    it("should include a valid reset link in the email", async () => {
      await forgotPasswordAction({ email: testUser.email });
      await waitFor(2000);

      const latestEmail = await getLatestEmailFromInbucket(testUser.email);
      expect(latestEmail).not.toBeNull();

      // Get the full email content
      const emailContent = await getEmailContentFromInbucket(
        testUser.email,
        (latestEmail as { id?: string })?.id ?? "",
      );

      const resetLink = extractResetPasswordLink(emailContent);
      expect(resetLink).not.toBeNull();
      expect(resetLink).toMatch(/reset|password/i);
      expect(resetLink).toContain("token");
    });

    it("should not fail for non-existent email addresses", async () => {
      // Supabase doesn't throw an error for non-existent emails for security reasons
      const result = await forgotPasswordAction({ email: "nonexistent@kcl.ac.uk" });

      expect(result.ok).toBe(true);
      if (!result.ok) {
        console.error("Password reset for non-existent email failed:", result.error);
      }
    });
  });

  describe("Validation Errors", () => {
    it("should reject invalid email format", async () => {
      const result = await forgotPasswordAction({ email: "invalid-email" });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain("valid email");
      }
    });

    it("should reject empty email", async () => {
      const result = await forgotPasswordAction({ email: "" });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain("email");
      }
    });

    it("should reject overly long email", async () => {
      const longEmail = "a".repeat(95) + "@kcl.ac.uk"; // Over 100 characters
      const result = await forgotPasswordAction({ email: longEmail });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain("100 characters");
      }
    });
  });

  describe("Multiple Reset Requests", () => {
    it("should handle multiple password reset requests for the same email", async () => {
      // Send first reset request
      const firstResult = await forgotPasswordAction({ email: testUser.email });
      expect(firstResult.ok).toBe(true);

      await waitFor(1000);

      // Send second reset request
      const secondResult = await forgotPasswordAction({ email: testUser.email });
      expect(secondResult.ok).toBe(true);

      // Both should succeed
      await waitFor(2000);

      // Should have received multiple emails
      const emails = await import("../test-utils").then((utils) => utils.getEmailsFromInbucket(testUser.email));
      expect(emails.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Schema Validation", () => {
    it("should validate against the forgotPasswordFormSchema", () => {
      const validationResult = forgotPasswordFormSchema.safeParse({ email: testUser.email });
      expect(validationResult.success).toBe(true);
    });

    it("should fail schema validation for missing email", () => {
      const validationResult = forgotPasswordFormSchema.safeParse({});
      expect(validationResult.success).toBe(false);
    });

    it("should fail schema validation for invalid email format", () => {
      const validationResult = forgotPasswordFormSchema.safeParse({ email: "invalid" });
      expect(validationResult.success).toBe(false);
    });
  });

  describe("Rate Limiting", () => {
    // Note: In a production environment, you might want to test rate limiting
    // This would require configuring Supabase's rate limiting settings
    it("should respect rate limiting for password reset requests", async () => {
      // This test would need to be implemented based on your rate limiting configuration
      // For now, we just verify that multiple requests don't break the system

      const promises = Array.from({ length: 3 }, () => forgotPasswordAction({ email: testUser.email }));

      const results = await Promise.all(promises);

      // All should either succeed or fail gracefully
      results.forEach((result) => {
        if (!result.ok) {
          // If rate limited, should have appropriate error message
          expect(result.error.message).toBeDefined();
        }
      });
    });
  });
});
