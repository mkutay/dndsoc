# Authentication Testing Suite

This testing suite demonstrates a functional programming approach to testing authentication flows using the Neverthrow library. The tests follow the same paradigm as the application code, using `ResultAsync` for error handling instead of try/catch blocks.

## Overview

The test suite covers all aspects of the authentication flow using functional programming patterns:

- **User Sign Up**: Normal user registration with KCL email addresses (functional approach)
- **Associates Sign Up**: External user requests for access (functional approach)
- **Sign In**: Authentication with email, username, or K-number
- **Password Reset**: Forgot password functionality
- **Integration Tests**: End-to-end authentication flows
- **Email Testing**: Email delivery via Inbucket

## Setup

### Prerequisites

1. **Local Supabase**: Ensure you have Supabase running locally
2. **Inbucket**: Email testing service should be running on `http://127.0.0.1:54324`
3. **Environment**: `.env.test` file configured with test credentials

### Environment Configuration

The tests use the `.env.test` file with the following variables:

```bash
# Local Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Test environment
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_NODE_ENV=test
MODE=test

# Inbucket email testing
INBUCKET_URL=http://127.0.0.1:54324
```

## Running Tests

### All Authentication Tests
```bash
npm test auth
```

### Specific Test Files
```bash
# User sign up tests
npm test src/tests/auth/sign-up.test.ts

# Associates sign up tests
npm test src/tests/auth/associates-sign-up.test.ts

# Sign in tests
npm test src/tests/auth/sign-in.test.ts

# Password reset tests
npm test src/tests/auth/password-reset.test.ts

# Integration tests
npm test src/tests/auth/integration.test.ts
```

### Watch Mode
```bash
npm test -- --watch
```

## Functional Programming Approach

This test suite uses the [Neverthrow](https://github.com/supermacro/neverthrow) library to implement functional error handling patterns, matching the application's architecture. Instead of try/catch blocks, we use `ResultAsync` for composable error handling.

### Key Benefits

1. **Composable Error Handling**: Chain operations without nested try/catch blocks
2. **Type-Safe Errors**: Errors are typed and handled explicitly
3. **Consistent Patterns**: Matches the application's functional paradigm
4. **Better Testing**: Clear success/failure paths in tests

### Example Pattern

```typescript
// Functional approach with ResultAsync
const result = await cleanupTestUser(testEmail)
  .andThen(() => createTestUser(userData))
  .andThen(() => verifyUserExists(testEmail));

if (result.isErr()) {
  console.error('Test failed:', result.error);
} else {
  console.log('Test passed:', result.value);
}
```

## Test Structure

### Core Testing Utilities (`test-utils.ts`)

The test utilities provide functional programming helpers for common testing operations:

#### User Management (Functional)
- `cleanupTestUser(email)` - Removes test users using `runServiceQuery`
- `expectUserToExist(email)` - Verifies user existence with functional error handling
- `expectUserNotToExist(email)` - Verifies user absence with functional error handling

#### Email Testing (Functional)
- `waitForEmailAndExtractLink(email, subject)` - Polls Inbucket API with retry logic
- `clearInbucketEmails()` - Cleans up test emails

#### Bridge Functions
- `promiseToResult(promise)` - Converts Promises to ResultAsync
- `resultToPromise(result)` - Converts ResultAsync back to Promise (for Vitest assertions)

### Test Files

- **`sign-up.test.ts`** - Normal user registration flow
- **`associates-sign-up.test.ts`** - Associates request system
- **`sign-in.test.ts`** - Authentication with multiple methods
- **`password-reset.test.ts`** - Password reset flow
- **`integration.test.ts`** - End-to-end user journeys
- **`functional.test.ts`** - Functional programming pattern demonstrations

## Usage Examples

### Basic Functional Test Pattern

```typescript
import { cleanupTestUser, expectUserToExist, resultToPromise } from '../test-utils';

test('user registration with functional approach', async () => {
  const testEmail = 'test@kcl.ac.uk';
  
  // Chain operations functionally
  const result = await cleanupTestUser(testEmail)
    .andThen(() => createUser({ email: testEmail, password: 'password123' }))
    .andThen(() => expectUserToExist(testEmail));
  
  // Convert to Promise for Vitest assertion
  await resultToPromise(result);
});
```

### Error Handling Example

```typescript
test('handles registration errors functionally', async () => {
  const result = await createUser({ email: 'invalid-email' })
    .mapErr(error => {
      // Transform error for better testing
      return new TestError(`Registration failed: ${error.message}`);
    });
  
  expect(result.isErr()).toBe(true);
  if (result.isErr()) {
    expect(result.error.message).toContain('Registration failed');
  }
});
```

## Email Testing

The tests use Inbucket to capture and verify emails sent during authentication:

- **Confirmation emails** for new user registrations
- **Password reset emails** for forgot password requests
- **Admin notifications** for associate requests

### Inbucket API

The test utilities provide functions to:
- Retrieve emails from mailboxes
- Extract confirmation/reset links
- Clear mailboxes for cleanup

## Database Testing

Tests use both public and service Supabase clients:

- **Public client**: For user-facing operations (sign up, sign in)
- **Service client**: For admin operations (user management, cleanup)

### Data Cleanup

Each test includes proper setup and teardown:
- Creates unique test data
- Cleans up after each test
- Prevents test interference

## Error Handling

Tests verify proper error handling for:
- Validation errors
- Network failures
- Database constraints
- Email delivery issues

## Best Practices

### Test Isolation
- Each test uses unique data
- Proper cleanup prevents side effects
- Tests can run in parallel

### Realistic Testing
- Uses actual Supabase auth system
- Tests real email delivery
- Validates complete flows

### Comprehensive Coverage
- Success and failure cases
- Edge cases and validation
- Integration scenarios

## Troubleshooting

### Common Issues

1. **Supabase not running**: Ensure local Supabase is started
2. **Inbucket not accessible**: Check if running on port 54324
3. **Environment variables**: Verify `.env.test` configuration
4. **Test data conflicts**: Ensure proper cleanup between tests

### Debugging

- Use `console.log` for debugging test data
- Check Inbucket web interface for email content
- Verify Supabase dashboard for auth users
- Use Vitest's debugging features

## Contributing

When adding new authentication features:

1. Add corresponding tests
2. Update test utilities if needed
3. Ensure proper cleanup
4. Test both success and failure cases
5. Update this documentation
