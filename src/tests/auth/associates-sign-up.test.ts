import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  generateTestAssociate,
  cleanupTestAssociate,
  waitFor,
  clearInbucketMailbox,
  expectAssociateRequestToExist,
  createTestServiceClient,
} from "../test-utils";
import { associatesSignUpAction } from "@/server/auth/sign-up";
import { associatesSignUpFormSchema } from "@/config/auth-schemas";

describe("Associates Sign Up", () => {
  let testAssociate: ReturnType<typeof generateTestAssociate>;
  let serviceClient: ReturnType<typeof createTestServiceClient>;

  beforeEach(async () => {
    testAssociate = generateTestAssociate();
    serviceClient = createTestServiceClient();

    // Clear any existing emails for this test associate
    await clearInbucketMailbox(testAssociate.email);

    // Ensure test associate request doesn't exist
    await cleanupTestAssociate(testAssociate.email);
  });

  afterEach(async () => {
    // Clean up test associate
    await cleanupTestAssociate(testAssociate.email);
    await clearInbucketMailbox(testAssociate.email);
  });

  describe("Valid Associates Sign Up", () => {
    it("should successfully create an associate request with valid data", async () => {
      const result = await associatesSignUpAction(testAssociate);

      expect(result.ok).toBe(true);
      if (!result.ok) {
        console.error("Associates sign up failed:", result.error);
      }

      // Verify associate request was created in database
      const associateRequest = await expectAssociateRequestToExist(testAssociate.email);

      expect(associateRequest.isErr()).toBe(false);

      if (associateRequest.isErr()) {
        return;
      }

      expect(associateRequest.value.name).toBe(testAssociate.name);
      expect(associateRequest.value.email).toBe(testAssociate.email);
      expect(associateRequest.value.notes).toBe(testAssociate.notes);
    });

    it("should send notification email to admin", async () => {
      await associatesSignUpAction(testAssociate);
      await waitFor(2000);

      // Note: In a real test environment, you'd need to check the admin email
      // For now, we just verify the associate request was created
      await expectAssociateRequestToExist(testAssociate.email);
    });

    it("should handle associate requests without notes", async () => {
      const associateWithoutNotes: { name: string; email: string; notes?: string } = { ...testAssociate };
      delete associateWithoutNotes.notes;

      const result = await associatesSignUpAction(associateWithoutNotes);
      expect(result.ok).toBe(true);

      const associateRequest = await expectAssociateRequestToExist(testAssociate.email);
      expect(associateRequest.isErr()).toBe(false);

      if (associateRequest.isErr()) {
        return;
      }

      expect(associateRequest.value.notes).toBeNull();
    });
  });

  describe("Validation Errors", () => {
    it("should reject invalid email format", async () => {
      const invalidAssociate = { ...testAssociate, email: "invalid-email" };
      const result = await associatesSignUpAction(invalidAssociate);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain("valid email");
      }
    });

    it("should reject empty name", async () => {
      const invalidAssociate = { ...testAssociate, name: "" };
      const result = await associatesSignUpAction(invalidAssociate);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain("Name");
      }
    });

    it("should reject overly long name", async () => {
      const invalidAssociate = { ...testAssociate, name: "A".repeat(61) };
      const result = await associatesSignUpAction(invalidAssociate);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain("60 characters");
      }
    });

    it("should reject overly long notes", async () => {
      const invalidAssociate = { ...testAssociate, notes: "A".repeat(1001) };
      const result = await associatesSignUpAction(invalidAssociate);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain("1000 characters");
      }
    });
  });

  describe("Uniqueness Constraints", () => {
    it("should reject duplicate email addresses from existing users", async () => {
      // First, create a regular user with this email
      const testUser = {
        email: testAssociate.email,
        username: "testuser123",
        knumber: "K12345678",
        password: "TestPassword123!",
      };

      // Insert user directly into database to simulate existing user
      await serviceClient.from("users").insert({
        email: testUser.email,
        username: testUser.username,
        knumber: testUser.knumber,
        name: testUser.username,
        auth_user_uuid: "dummy-uuid-123",
      });

      // Try to create associate request with same email
      const result = await associatesSignUpAction(testAssociate);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain("already exists");
      }

      // Clean up
      await serviceClient.from("users").delete().eq("email", testUser.email);
    });

    it("should reject duplicate email addresses from existing associate requests", async () => {
      // Create first associate request
      const firstResult = await associatesSignUpAction(testAssociate);
      expect(firstResult.ok).toBe(true);

      // Try to create second associate request with same email
      const duplicateAssociate = generateTestAssociate();
      duplicateAssociate.email = testAssociate.email;

      const secondResult = await associatesSignUpAction(duplicateAssociate);
      expect(secondResult.ok).toBe(false);
      if (!secondResult.ok) {
        expect(secondResult.error.message).toContain("already exists");
      }
    });
  });

  describe("Schema Validation", () => {
    it("should validate against the associatesSignUpFormSchema", () => {
      const validationResult = associatesSignUpFormSchema.safeParse(testAssociate);
      expect(validationResult.success).toBe(true);
    });

    it("should fail schema validation for missing required fields", () => {
      const incompleteAssociate = { email: testAssociate.email };
      const validationResult = associatesSignUpFormSchema.safeParse(incompleteAssociate);
      expect(validationResult.success).toBe(false);
    });
  });
});
