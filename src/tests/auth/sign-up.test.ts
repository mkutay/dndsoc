import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  generateTestUser,
  cleanupTestUserAsync,
  waitFor,
  clearInbucketMailboxAsync,
  getLatestEmailFromInbucketAsync,
  extractConfirmationLink,
  createTestServiceClient,
  getEmailContentFromInbucketAsync,
} from "../test-utils";
import { signUpAction } from "@/server/auth/sign-up";
import { signUpFormSchema } from "@/config/auth-schemas";

describe("User Sign Up", () => {
  let testUser: ReturnType<typeof generateTestUser>;
  let serviceClient: ReturnType<typeof createTestServiceClient>;

  beforeEach(async () => {
    testUser = generateTestUser();
    serviceClient = createTestServiceClient();

    // Clear any existing emails for this test user
    await clearInbucketMailboxAsync(testUser.email);

    // Ensure test user doesn't exist
    await cleanupTestUserAsync(testUser.email);
  });

  afterEach(async () => {
    // Clean up test user
    await cleanupTestUserAsync(testUser.email);
    await clearInbucketMailboxAsync(testUser.email);
  });

  describe("Valid Sign Up", () => {
    it("should successfully sign up a new user with valid data", async () => {
      const result = await signUpAction(testUser);

      expect(result.ok).toBe(true);
      if (!result.ok) {
        console.error("Sign up failed:", result.error);
      }

      // Wait a moment for email to be sent
      await waitFor(2000);

      // Check that confirmation email was sent to Inbucket
      const latestEmail = await getLatestEmailFromInbucketAsync(testUser.email);
      expect(latestEmail).not.toBeNull();
      expect(latestEmail).toHaveProperty("subject");
      expect((latestEmail as { subject?: string })?.subject).toContain("confirm");

      // Verify user exists in auth.users but is not confirmed yet
      const { data: authUsers } = await serviceClient.auth.admin.listUsers();
      const authUser = authUsers.users.find((user) => user.email === testUser.email);
      expect(authUser).not.toBeNull();
      expect(authUser?.email_confirmed_at).toBeNull();
    });

    it("should store correct user metadata during sign up", async () => {
      const result = await signUpAction(testUser);
      expect(result.ok).toBe(true);

      // Get the created auth user
      const { data: authUsers } = await serviceClient.auth.admin.listUsers();
      const authUser = authUsers.users.find((user) => user.email === testUser.email);
      expect(authUser).not.toBeNull();

      // Check that metadata is correctly stored
      expect(authUser?.user_metadata).toMatchObject({
        username: testUser.username,
        knumber: testUser.knumber,
        name: testUser.username, // As per the signUpUser function
        email: testUser.email,
        siteUrl: expect.any(String),
      });
    });

    it("should include a valid confirmation link in the email", async () => {
      await signUpAction(testUser);
      await waitFor(2000);

      const latestEmail = await getLatestEmailFromInbucketAsync(testUser.email);
      expect(latestEmail).not.toBeNull();

      // Get the full email content
      const emailContent = await getEmailContentFromInbucketAsync(
        testUser.email,
        (latestEmail as { id?: string })?.id ?? "",
      );

      const confirmationLink = extractConfirmationLink(emailContent as { body?: { html?: string } });
      expect(confirmationLink).not.toBeNull();
      expect(confirmationLink).toContain("confirm");
      expect(confirmationLink).toContain("token");
    });
  });

  describe("Validation Errors", () => {
    it("should reject invalid email format", async () => {
      const invalidUser = { ...testUser, email: "invalid-email" };
      const result = await signUpAction(invalidUser);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain("valid email");
      }
    });

    it("should reject non-KCL email addresses", async () => {
      const invalidUser = { ...testUser, email: "test@gmail.com" };
      const result = await signUpAction(invalidUser);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain("@kcl.ac.uk");
      }
    });

    it("should reject invalid K-number format", async () => {
      const invalidUser = { ...testUser, knumber: "123456789" };
      const result = await signUpAction(invalidUser);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain("K-number");
      }
    });

    it("should reject short passwords", async () => {
      const invalidUser = { ...testUser, password: "123" };
      const result = await signUpAction(invalidUser);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain("6 characters");
      }
    });

    it("should reject invalid username format", async () => {
      const invalidUser = { ...testUser, username: "user@name!" };
      const result = await signUpAction(invalidUser);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain("Username");
      }
    });
  });

  describe("Uniqueness Constraints", () => {
    it("should reject duplicate email addresses", async () => {
      // Create first user
      const firstResult = await signUpAction(testUser);
      expect(firstResult.ok).toBe(true);

      // Try to create second user with same email
      const duplicateUser = generateTestUser();
      duplicateUser.email = testUser.email;

      const secondResult = await signUpAction(duplicateUser);
      expect(secondResult.ok).toBe(false);
      if (!secondResult.ok) {
        expect(secondResult.error.message).toContain("already exists");
      }
    });

    it("should reject duplicate usernames", async () => {
      // Create first user
      const firstResult = await signUpAction(testUser);
      expect(firstResult.ok).toBe(true);

      // Try to create second user with same username
      const duplicateUser = generateTestUser();
      duplicateUser.username = testUser.username;

      const secondResult = await signUpAction(duplicateUser);
      expect(secondResult.ok).toBe(false);
      if (!secondResult.ok) {
        expect(secondResult.error.message).toContain("already exists");
      }
    });

    it("should reject duplicate K-numbers", async () => {
      // Create first user
      const firstResult = await signUpAction(testUser);
      expect(firstResult.ok).toBe(true);

      // Try to create second user with same K-number
      const duplicateUser = generateTestUser();
      duplicateUser.knumber = testUser.knumber;

      const secondResult = await signUpAction(duplicateUser);
      expect(secondResult.ok).toBe(false);
      if (!secondResult.ok) {
        expect(secondResult.error.message).toContain("already exists");
      }
    });
  });

  describe("Schema Validation", () => {
    it("should validate against the signUpFormSchema", () => {
      const validationResult = signUpFormSchema.safeParse(testUser);
      expect(validationResult.success).toBe(true);
    });

    it("should fail schema validation for missing fields", () => {
      const incompleteUser = { email: testUser.email, password: testUser.password };
      const validationResult = signUpFormSchema.safeParse(incompleteUser);
      expect(validationResult.success).toBe(false);
    });
  });
});
