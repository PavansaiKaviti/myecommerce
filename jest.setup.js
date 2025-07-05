import "@testing-library/jest-dom";

// Mock Next.js router
jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "/",
      query: {},
      asPath: "/",
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    };
  },
}));

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  usePathname() {
    return "/";
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock Next.js image
jest.mock("next/image", () => ({
  __esModule: true,
  default: function MockImage(props) {
    // eslint-disable-next-line @next/next/no-img-element
    return require("react").createElement("img", {
      ...props,
      alt: props.alt || "",
    });
  },
}));

// Mock environment variables
process.env.NEXT_PUBLIC_DOMAIN_API = "http://localhost:3000/api";
process.env.NEXT_PUBLIC_LOCAL_API = "http://localhost:3000";
process.env.GOOGLE_CLIENT_ID = "test-client-id";
process.env.GOOGLE_CLIENT_SECRET = "test-client-secret";
process.env.MONGOOSE_URL = "mongodb://localhost:27017/test";
process.env.STRIPE_SECRET_KEY = "test-stripe-secret";
process.env.WEBHOOK_SECRET = "test-webhook-secret";
process.env.CLOUD_NAME = "test-cloud";
process.env.CLOUD_API_KEY = "test-api-key";
process.env.CLOUD_API_SECRET = "test-api-secret";

// Mock fetch globally
global.fetch = jest.fn();

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock toast notifications
jest.mock("@/components/toast/Toast", () => ({
  useToast: jest.fn(() => ({
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
    removeToast: jest.fn(),
  })),
}));

// Mock DOMPurify
jest.mock("isomorphic-dompurify", () => ({
  __esModule: true,
  default: {
    sanitize: jest.fn((input) => input),
  },
}));

// Mock Cloudinary (simplified)
jest.mock("cloudinary", () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload: jest.fn().mockResolvedValue({
        secure_url: "https://res.cloudinary.com/test/image/upload/test.jpg",
        public_id: "test",
      }),
    },
  },
}));

// Mock Stripe
jest.mock("stripe", () => {
  return jest.fn().mockImplementation(() => ({
    checkout: {
      sessions: {
        create: jest.fn().mockResolvedValue({
          url: "https://checkout.stripe.com/test",
          id: "cs_test_123",
        }),
      },
    },
    webhooks: {
      constructEvent: jest.fn().mockReturnValue({
        type: "checkout.session.completed",
        data: {
          object: {
            id: "cs_test_123",
            metadata: {
              user: "test-user-id",
              product: '["test-product-id"]',
              shippingAddress: '{"address":"test"}',
            },
            payment_intent: "pi_test_123",
            amount_total: 1000,
            created: Date.now() / 1000,
          },
        },
      }),
    },
  }));
});

// Mock NextAuth
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(() => ({
    data: null,
    status: "unauthenticated",
  })),
  signIn: jest.fn(),
  signOut: jest.fn(),
  getProviders: jest.fn().mockResolvedValue({
    google: {
      id: "google",
      name: "Google",
      type: "oauth",
    },
  }),
}));

// Mock Redux
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(() => jest.fn()),
}));

// Mock mongoose
jest.mock("mongoose", () => ({
  connect: jest.fn(),
  set: jest.fn(),
  models: {},
  model: jest.fn(),
  Schema: {
    Types: {
      ObjectId: "ObjectId",
    },
  },
  Types: {
    ObjectId: {
      isValid: jest.fn(() => true),
    },
  },
}));

// Setup global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => "mocked-url");
global.URL.revokeObjectURL = jest.fn();
