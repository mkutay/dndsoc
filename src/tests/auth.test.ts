/**
 * Authentication Test Suite
 *
 * This file imports all authentication-related tests to ensure they are discovered
 * and run by the Vitest test runner.
 *
 * The test suite covers:
 * - User sign up (normal users with KCL emails)
 * - Associates sign up (external users requesting access)
 * - Sign in with email, username, or K-number
 * - Password reset functionality
 * - Complete integration flows
 * - Email delivery via Inbucket
 * - Error handling and validation
 *
 * To run these tests:
 * - Ensure your local Supabase is running with Inbucket email service
 * - Run: npm test
 * - Or run specific test files: npm test auth/sign-up.test.ts
 */

// Import all authentication test files to ensure they are run
import "./auth/sign-up.test";
import "./auth/associates-sign-up.test";
import "./auth/sign-in.test";
import "./auth/password-reset.test";
import "./auth/integration.test";

export {}; // Ensure this file is treated as a module
