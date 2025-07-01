# Testing Documentation

## Overview

This document provides comprehensive information about the testing setup for the e-commerce application. The project uses Jest as the testing framework with React Testing Library for component testing.

## Testing Stack

- **Jest**: JavaScript testing framework
- **React Testing Library**: Component testing utilities
- **@testing-library/jest-dom**: Custom Jest matchers for DOM testing
- **@testing-library/user-event**: User interaction simulation
- **jsdom**: DOM environment for Node.js

## Test Structure

```
__tests__/
├── basic.test.js              # Basic functionality tests
├── simple.test.js             # Simple component and utility tests
├── utils/
│   ├── validation.test.js     # Input validation tests
│   └── security.test.js       # Security utility tests
├── components/
│   ├── Navbar.test.jsx        # Navbar component tests
│   └── ProductCard.test.jsx   # Product card component tests
├── api/
│   ├── products.test.js       # Products API tests
│   └── auth.test.js           # Authentication API tests
└── integration/
    └── e2e.test.js            # End-to-end integration tests
```

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Specific Test Files

```bash
npm test -- __tests__/simple.test.js
npm test -- __tests__/utils/validation.test.js
npm test -- __tests__/components/Navbar.test.jsx
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

### Run Security Tests Only

```bash
npm run test:security
```

## Test Categories

### 1. Unit Tests

#### Basic Functionality Tests (`basic.test.js`)

- Basic arithmetic operations
- Async operation handling
- Fetch API mocking

#### Simple Component Tests (`simple.test.js`)

- React component rendering
- Props handling
- Utility function testing
- Security validation

### 2. Component Tests

#### Navbar Component (`Navbar.test.jsx`)

- **Rendering Tests**

  - Logo and navigation links display
  - Cart icon with item count
  - Authentication state handling
  - Admin link visibility

- **Interaction Tests**

  - Navigation link clicks
  - Mobile menu toggle
  - Cart functionality
  - User authentication states

- **Accessibility Tests**
  - ARIA labels
  - Keyboard navigation
  - Screen reader compatibility

#### Product Card Component (`ProductCard.test.jsx`)

- **Display Tests**

  - Product information rendering
  - Image handling
  - Price formatting
  - Stock status display

- **Interaction Tests**
  - Add to cart functionality
  - View details navigation
  - Quantity updates
  - Error handling

### 3. API Tests

#### Products API (`products.test.js`)

- **GET /api/products**

  - Pagination handling
  - Search functionality
  - Category filtering
  - Price range filtering
  - Sorting options

- **POST /api/products**

  - Product creation
  - Input validation
  - File upload handling
  - Error responses

- **Security Tests**
  - SQL injection prevention
  - XSS protection
  - Input sanitization
  - Rate limiting

#### Authentication API (`auth.test.js`)

- **Session Management**

  - User authentication
  - Session validation
  - Token handling

- **Security Tests**
  - Password strength validation
  - Brute force protection
  - CSRF protection
  - JWT validation

### 4. Security Tests

#### Input Validation (`validation.test.js`)

- **Email Validation**

  - Valid email formats
  - Invalid email rejection
  - XSS attempt prevention

- **Password Validation**

  - Strong password requirements
  - Weak password rejection
  - Special character requirements

- **Data Sanitization**
  - HTML content sanitization
  - SQL injection prevention
  - XSS attack prevention

#### Security Utilities (`security.test.js`)

- **CSRF Protection**

  - Token generation
  - Token validation
  - Attack prevention

- **Rate Limiting**
  - Request limiting
  - IP-based restrictions
  - Brute force protection

### 5. Integration Tests

#### End-to-End Tests (`e2e.test.js`)

- **User Journey Tests**

  - Product browsing flow
  - Shopping cart functionality
  - Checkout process
  - User authentication

- **Error Handling**
  - Network error handling
  - Server error responses
  - Graceful degradation

## Test Configuration

### Jest Configuration (`package.json`)

```json
{
  "jest": {
    "testEnvironment": "jsdom",
    "setupFilesAfterEnv": ["<rootDir>/jest.setup.js"],
    "moduleNameMapper": {
      "^@/(.*)$": "<rootDir>/$1",
      "^@/components/(.*)$": "<rootDir>/components/$1",
      "^@/utils/(.*)$": "<rootDir>/utils/$1",
      "^@/config/(.*)$": "<rootDir>/config/$1",
      "^@/models/(.*)$": "<rootDir>/models/$1",
      "^@/app/(.*)$": "<rootDir>/app/$1"
    },
    "collectCoverageFrom": [
      "**/*.{js,jsx}",
      "!**/node_modules/**",
      "!**/.next/**",
      "!**/coverage/**"
    ]
  }
}
```

### Babel Configuration (`babel.config.js`)

```javascript
module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    ["@babel/preset-react", { runtime: "automatic" }],
  ],
  plugins: ["@babel/plugin-transform-runtime"],
};
```

## Mocking Strategy

### Global Mocks (`jest.setup.js`)

#### Next.js Mocks

- Router navigation
- Image component
- Navigation hooks

#### External Libraries

- NextAuth for authentication
- Redux for state management
- Stripe for payments
- Cloudinary for file uploads
- Mongoose for database operations

#### Browser APIs

- Fetch API
- ResizeObserver
- IntersectionObserver
- URL.createObjectURL

## Test Utilities

### Custom Matchers

```javascript
// Custom matchers for common assertions
expect(element).toBeInTheDocument();
expect(element).toHaveClass("className");
expect(element).toHaveAttribute("attr", "value");
```

### Test Helpers

```javascript
// Mock request/response objects
const createMockRequest = (method, body, headers) => ({...});
const createMockResponse = () => ({...});

// Test data factories
const createMockProduct = (overrides) => ({...});
const createMockUser = (overrides) => ({...});
```

## Best Practices

### 1. Test Organization

- Group related tests using `describe` blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### 2. Component Testing

- Test user interactions, not implementation details
- Use semantic queries (getByRole, getByLabelText)
- Test accessibility features

### 3. API Testing

- Mock external dependencies
- Test error scenarios
- Validate response formats

### 4. Security Testing

- Test input validation thoroughly
- Verify XSS and SQL injection prevention
- Test authentication and authorization

### 5. Performance Testing

- Avoid unnecessary re-renders in tests
- Mock heavy operations
- Test with realistic data sizes

## Coverage Goals

- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

## Continuous Integration

### GitHub Actions Workflow

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "18"
      - run: npm ci
      - run: npm test
      - run: npm run test:coverage
```

## Troubleshooting

### Common Issues

1. **Module Resolution Errors**

   - Check `moduleNameMapper` configuration
   - Verify file paths and extensions

2. **JSX Parsing Errors**

   - Ensure Babel configuration is correct
   - Check for missing React imports

3. **Mock Failures**

   - Verify mock setup in `jest.setup.js`
   - Check import/export syntax

4. **Async Test Failures**
   - Use `waitFor` for async operations
   - Properly mock async functions

### Debug Commands

```bash
# Run tests with verbose output
npm test -- --verbose

# Run specific test with debugging
npm test -- --testNamePattern="test name"

# Show Jest configuration
npx jest --showConfig
```

## Future Enhancements

1. **Visual Regression Testing**

   - Add Storybook for component documentation
   - Implement visual testing with Chromatic

2. **Performance Testing**

   - Add Lighthouse CI
   - Bundle size monitoring

3. **E2E Testing**

   - Add Playwright or Cypress
   - Cross-browser testing

4. **API Contract Testing**
   - Add Pact for API contract testing
   - Consumer-driven contract testing

## Contributing

When adding new tests:

1. Follow the existing test structure
2. Use descriptive test names
3. Add appropriate mocks
4. Ensure good coverage
5. Update this documentation

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
