import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { generateTestUser, cleanupTestUser, waitFor, createTestServiceClient } from "../test-utils";
import { signInAction } from "@/server/auth/sign-in";
import { signUpAction } from "@/server/auth/sign-up";
import { signInFormSchema } from "@/config/auth-schemas";

describe("Sign In", () => {
  let testUser: ReturnType<typeof generateTestUser>;
  let serviceClient: ReturnType<typeof createTestServiceClient>;

  beforeEach(async () => {
    testUser = generateTestUser();
    serviceClient = createTestServiceClient();

    // Ensure test user doesn't exist
    await cleanupTestUser(testUser.email);

    // Create a confirmed user for sign in tests
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
  });

  describe("Valid Sign In", () => {
    it("should successfully sign in with email and password", async () => {
      const result = await signInAction({
        identifier: testUser.email,
        password: testUser.password,
      });

      expect(result.ok).toBe(true);
      if (!result.ok) {
        console.error("Sign in failed:", result.error);
      }
    });

    it("should successfully sign in with username and password", async () => {
      const result = await signInAction({
        identifier: testUser.username,
        password: testUser.password,
      });

      expect(result.ok).toBe(true);
      if (!result.ok) {
        console.error("Sign in with username failed:", result.error);
      }
    });

    it("should successfully sign in with K-number and password", async () => {
      const result = await signInAction({
        identifier: testUser.knumber,
        password: testUser.password,
      });

      expect(result.ok).toBe(true);
      if (!result.ok) {
        console.error("Sign in with K-number failed:", result.error);
      }
    });
  });

  describe("Invalid Credentials", () => {
    it("should reject sign in with wrong password", async () => {
      const result = await signInAction({
        identifier: testUser.email,
        password: "wrongpassword",
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain("Failed to sign in");
      }
    });

    it("should reject sign in with non-existent email", async () => {
      const result = await signInAction({
        identifier: "nonexistent@kcl.ac.uk",
        password: testUser.password,
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain("Failed to sign in");
      }
    });

    it("should reject sign in with non-existent username", async () => {
      const result = await signInAction({
        identifier: "nonexistentuser",
        password: testUser.password,
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        // Should fail because username doesn't exist in database
        expect(result.error.code).toBe("DATABASE_ERROR");
      }
    });

    it("should reject sign in with non-existent K-number", async () => {
      const result = await signInAction({
        identifier: "K99999999",
        password: testUser.password,
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        // Should fail because K-number doesn't exist in database
        expect(result.error.code).toBe("DATABASE_ERROR");
      }
    });
  });

  describe("Validation Errors", () => {
    it("should reject invalid identifier format", async () => {
      const result = await signInAction({
        identifier: "invalid@identifier!",
        password: testUser.password,
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain("Identifier must be a valid");
      }
    });

    it("should reject empty password", async () => {
      const result = await signInAction({
        identifier: testUser.email,
        password: "",
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain("Password");
      }
    });

    it("should reject short password", async () => {
      const result = await signInAction({
        identifier: testUser.email,
        password: "123",
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain("6 characters");
      }
    });
  });

  describe("Schema Validation", () => {
    it("should validate against the signInFormSchema", () => {
      const validationResult = signInFormSchema.safeParse({
        identifier: testUser.email,
        password: testUser.password,
      });
      expect(validationResult.success).toBe(true);
    });

    it("should fail schema validation for missing fields", () => {
      const incompleteData = { identifier: testUser.email };
      const validationResult = signInFormSchema.safeParse(incompleteData);
      expect(validationResult.success).toBe(false);
    });
  });

  describe("Identifier Type Detection", () => {
    it("should correctly identify email format", () => {
      const emailResult = signInFormSchema.safeParse({
        identifier: "test@kcl.ac.uk",
        password: "password123",
      });
      expect(emailResult.success).toBe(true);
    });

    it("should correctly identify K-number format", () => {
      const knumberResult = signInFormSchema.safeParse({
        identifier: "K12345678",
        password: "password123",
      });
      expect(knumberResult.success).toBe(true);
    });

    it("should correctly identify username format", () => {
      const usernameResult = signInFormSchema.safeParse({
        identifier: "testuser123",
        password: "password123",
      });
      expect(usernameResult.success).toBe(true);
    });
  });
});
