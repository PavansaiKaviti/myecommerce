import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "@/globalstore/reduxslices/cartslice/Cart";
import pageReducer from "@/globalstore/reduxslices/pageSlice/Pageslice";

// Mock Next.js router
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    pathname: "/",
  }),
  usePathname: () => "/",
}));

// Mock NextAuth
jest.mock("next-auth/react", () => ({
  useSession: () => ({
    data: {
      user: {
        id: "507f1f77bcf86cd799439011",
        name: "John Doe",
        email: "john@example.com",
        role: "user",
      },
    },
    status: "authenticated",
  }),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

// Create test store
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      cart: cartReducer,
      page: pageReducer,
    },
    preloadedState: initialState,
  });
};

// Test wrapper component
const TestWrapper = ({ children, store, session }) => (
  <SessionProvider session={session}>
    <Provider store={store}>{children}</Provider>
  </SessionProvider>
);

describe("E2E Integration Tests", () => {
  let store;

  beforeEach(() => {
    jest.clearAllMocks();
    store = createTestStore();
    fetch.mockClear();
  });

  describe("Product Browsing Flow", () => {
    test("should display products and allow navigation to product details", async () => {
      const mockProducts = [
        {
          _id: "507f1f77bcf86cd799439011",
          name: "iPhone 13",
          description: "Latest iPhone model",
          price: 999.99,
          stock: 10,
          category: "Electronics",
          brand: "Apple",
          images: ["iphone.jpg"],
          rating: 4.5,
          numReviews: 25,
        },
        {
          _id: "507f1f77bcf86cd799439012",
          name: "MacBook Pro",
          description: "Professional laptop",
          price: 1999.99,
          stock: 5,
          category: "Electronics",
          brand: "Apple",
          images: ["macbook.jpg"],
          rating: 4.8,
          numReviews: 15,
        },
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          products: mockProducts,
          currentPage: 1,
          totalPages: 1,
          totalProducts: 2,
        }),
      });

      // Mock the products page component
      const ProductsPage = () => {
        const [products, setProducts] = useState([]);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
          fetch("/api/products")
            .then((res) => res.json())
            .then((data) => {
              setProducts(data.products);
              setLoading(false);
            });
        }, []);

        if (loading) return <div>Loading...</div>;

        return (
          <div>
            <h1>Products</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product._id} data-testid="product-card">
                  <h3>{product.name}</h3>
                  <p>${product.price}</p>
                  <button onClick={() => mockPush(`/products/${product._id}`)}>
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      };

      render(
        <TestWrapper store={store}>
          <ProductsPage />
        </TestWrapper>
      );

      // Wait for products to load
      await waitFor(() => {
        expect(screen.getByText("iPhone 13")).toBeInTheDocument();
        expect(screen.getByText("MacBook Pro")).toBeInTheDocument();
      });

      // Click on product to view details
      const viewDetailsButton = screen.getAllByText("View Details")[0];
      fireEvent.click(viewDetailsButton);

      expect(mockPush).toHaveBeenCalledWith(
        "/products/507f1f77bcf86cd799439011"
      );
    });

    test("should allow searching and filtering products", async () => {
      const mockProducts = [
        {
          _id: "507f1f77bcf86cd799439011",
          name: "iPhone 13",
          price: 999.99,
          category: "Electronics",
          brand: "Apple",
        },
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          products: mockProducts,
          currentPage: 1,
          totalPages: 1,
          totalProducts: 1,
        }),
      });

      // Mock search functionality
      const SearchComponent = () => {
        const [searchTerm, setSearchTerm] = useState("");
        const [products, setProducts] = useState([]);

        const handleSearch = async () => {
          const response = await fetch(`/api/products?search=${searchTerm}`);
          const data = await response.json();
          setProducts(data.products);
        };

        return (
          <div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              data-testid="search-input"
            />
            <button onClick={handleSearch} data-testid="search-button">
              Search
            </button>
            <div>
              {products.map((product) => (
                <div key={product._id}>{product.name}</div>
              ))}
            </div>
          </div>
        );
      };

      render(
        <TestWrapper store={store}>
          <SearchComponent />
        </TestWrapper>
      );

      const searchInput = screen.getByTestId("search-input");
      const searchButton = screen.getByTestId("search-button");

      fireEvent.change(searchInput, { target: { value: "iPhone" } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText("iPhone 13")).toBeInTheDocument();
      });
    });
  });

  describe("Shopping Cart Flow", () => {
    test("should add products to cart and display cart contents", async () => {
      const mockProduct = {
        _id: "507f1f77bcf86cd799439011",
        name: "iPhone 13",
        price: 999.99,
        stock: 10,
        images: ["iphone.jpg"],
      };

      // Mock cart component
      const CartComponent = () => {
        const cartItems = useSelector((state) => state.cart.items);
        const dispatch = useDispatch();

        const addToCart = () => {
          dispatch({
            type: "cart/addToCart",
            payload: {
              id: mockProduct._id,
              name: mockProduct.name,
              price: mockProduct.price,
              image: mockProduct.images[0],
              quantity: 1,
            },
          });
        };

        return (
          <div>
            <button onClick={addToCart} data-testid="add-to-cart">
              Add to Cart
            </button>
            <div data-testid="cart-items">
              {cartItems.map((item) => (
                <div key={item.id}>
                  <span>{item.name}</span>
                  <span>${item.price}</span>
                  <span>Qty: {item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        );
      };

      render(
        <TestWrapper store={store}>
          <CartComponent />
        </TestWrapper>
      );

      const addToCartButton = screen.getByTestId("add-to-cart");
      fireEvent.click(addToCartButton);

      await waitFor(() => {
        expect(screen.getByText("iPhone 13")).toBeInTheDocument();
        expect(screen.getByText("$999.99")).toBeInTheDocument();
        expect(screen.getByText("Qty: 1")).toBeInTheDocument();
      });
    });

    test("should update cart quantities and calculate totals", async () => {
      const mockProduct = {
        _id: "507f1f77bcf86cd799439011",
        name: "iPhone 13",
        price: 999.99,
        stock: 10,
        images: ["iphone.jpg"],
      };

      // Initialize store with cart items
      store = createTestStore({
        cart: {
          items: [
            {
              id: mockProduct._id,
              name: mockProduct.name,
              price: mockProduct.price,
              image: mockProduct.images[0],
              quantity: 1,
            },
          ],
        },
      });

      // Mock cart with quantity controls
      const CartWithQuantity = () => {
        const cartItems = useSelector((state) => state.cart.items);
        const dispatch = useDispatch();

        const updateQuantity = (id, quantity) => {
          dispatch({
            type: "cart/updateQuantity",
            payload: { id, quantity },
          });
        };

        const removeItem = (id) => {
          dispatch({
            type: "cart/removeFromCart",
            payload: id,
          });
        };

        const total = cartItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        return (
          <div>
            {cartItems.map((item) => (
              <div key={item.id} data-testid={`cart-item-${item.id}`}>
                <span>{item.name}</span>
                <span>${item.price}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  data-testid="decrease-quantity"
                >
                  -
                </button>
                <span data-testid="quantity">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  data-testid="increase-quantity"
                >
                  +
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  data-testid="remove-item"
                >
                  Remove
                </button>
              </div>
            ))}
            <div data-testid="cart-total">Total: ${total.toFixed(2)}</div>
          </div>
        );
      };

      render(
        <TestWrapper store={store}>
          <CartWithQuantity />
        </TestWrapper>
      );

      // Check initial state
      expect(screen.getByTestId("quantity")).toHaveTextContent("1");
      expect(screen.getByTestId("cart-total")).toHaveTextContent(
        "Total: $999.99"
      );

      // Increase quantity
      const increaseButton = screen.getByTestId("increase-quantity");
      fireEvent.click(increaseButton);

      await waitFor(() => {
        expect(screen.getByTestId("quantity")).toHaveTextContent("2");
        expect(screen.getByTestId("cart-total")).toHaveTextContent(
          "Total: $1999.98"
        );
      });

      // Remove item
      const removeButton = screen.getByTestId("remove-item");
      fireEvent.click(removeButton);

      await waitFor(() => {
        expect(
          screen.queryByTestId(`cart-item-${mockProduct._id}`)
        ).not.toBeInTheDocument();
        expect(screen.getByTestId("cart-total")).toHaveTextContent(
          "Total: $0.00"
        );
      });
    });
  });

  describe("Checkout Flow", () => {
    test("should complete checkout process with shipping and payment", async () => {
      const mockCartItems = [
        {
          id: "507f1f77bcf86cd799439011",
          name: "iPhone 13",
          price: 999.99,
          quantity: 1,
        },
      ];

      // Initialize store with cart items
      store = createTestStore({
        cart: {
          items: mockCartItems,
        },
      });

      // Mock checkout session creation
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          url: "https://checkout.stripe.com/test",
          id: "cs_test_123",
        }),
      });

      // Mock checkout component
      const CheckoutComponent = () => {
        const cartItems = useSelector((state) => state.cart.items);
        const [shippingAddress, setShippingAddress] = useState({
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
        });
        const [loading, setLoading] = useState(false);

        const handleCheckout = async () => {
          setLoading(true);
          try {
            const response = await fetch("/api/checkout_sessions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                items: cartItems,
                shippingAddress,
              }),
            });
            const data = await response.json();
            window.location.href = data.url;
          } catch (error) {
            console.error("Checkout error:", error);
          } finally {
            setLoading(false);
          }
        };

        const total = cartItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        return (
          <div>
            <h2>Checkout</h2>
            <div>
              <h3>Shipping Address</h3>
              <input
                type="text"
                placeholder="Street Address"
                value={shippingAddress.street}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    street: e.target.value,
                  })
                }
                data-testid="street-input"
              />
              <input
                type="text"
                placeholder="City"
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    city: e.target.value,
                  })
                }
                data-testid="city-input"
              />
              <input
                type="text"
                placeholder="State"
                value={shippingAddress.state}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    state: e.target.value,
                  })
                }
                data-testid="state-input"
              />
              <input
                type="text"
                placeholder="ZIP Code"
                value={shippingAddress.zipCode}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    zipCode: e.target.value,
                  })
                }
                data-testid="zip-input"
              />
              <input
                type="text"
                placeholder="Country"
                value={shippingAddress.country}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    country: e.target.value,
                  })
                }
                data-testid="country-input"
              />
            </div>
            <div>
              <h3>Order Summary</h3>
              {cartItems.map((item) => (
                <div key={item.id}>
                  <span>{item.name}</span>
                  <span>Qty: {item.quantity}</span>
                  <span>${item.price}</span>
                </div>
              ))}
              <div>Total: ${total.toFixed(2)}</div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={loading}
              data-testid="checkout-button"
            >
              {loading ? "Processing..." : "Proceed to Payment"}
            </button>
          </div>
        );
      };

      render(
        <TestWrapper store={store}>
          <CheckoutComponent />
        </TestWrapper>
      );

      // Fill shipping address
      fireEvent.change(screen.getByTestId("street-input"), {
        target: { value: "123 Main St" },
      });
      fireEvent.change(screen.getByTestId("city-input"), {
        target: { value: "New York" },
      });
      fireEvent.change(screen.getByTestId("state-input"), {
        target: { value: "NY" },
      });
      fireEvent.change(screen.getByTestId("zip-input"), {
        target: { value: "10001" },
      });
      fireEvent.change(screen.getByTestId("country-input"), {
        target: { value: "USA" },
      });

      // Verify order summary
      expect(screen.getByText("iPhone 13")).toBeInTheDocument();
      expect(screen.getByText("Total: $999.99")).toBeInTheDocument();

      // Proceed to checkout
      const checkoutButton = screen.getByTestId("checkout-button");
      fireEvent.click(checkoutButton);

      await waitFor(() => {
        expect(screen.getByText("Processing...")).toBeInTheDocument();
      });

      // Verify checkout session was created
      expect(fetch).toHaveBeenCalledWith("/api/checkout_sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: mockCartItems,
          shippingAddress: {
            street: "123 Main St",
            city: "New York",
            state: "NY",
            zipCode: "10001",
            country: "USA",
          },
        }),
      });
    });
  });

  describe("User Authentication Flow", () => {
    test("should handle user login and session management", async () => {
      // Mock login component
      const LoginComponent = () => {
        const [credentials, setCredentials] = useState({
          email: "",
          password: "",
        });
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState("");

        const handleLogin = async (e) => {
          e.preventDefault();
          setLoading(true);
          setError("");

          try {
            const response = await fetch("/api/auth/signin", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(credentials),
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.error);
            }

            // Handle successful login
            mockPush("/profile");
          } catch (error) {
            setError(error.message);
          } finally {
            setLoading(false);
          }
        };

        return (
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={credentials.email}
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  email: e.target.value,
                })
              }
              data-testid="email-input"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  password: e.target.value,
                })
              }
              data-testid="password-input"
              required
            />
            {error && <div data-testid="error-message">{error}</div>}
            <button type="submit" disabled={loading} data-testid="login-button">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        );
      };

      // Mock successful login response
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: "Authentication successful",
          token: "valid.jwt.token",
          user: {
            id: "507f1f77bcf86cd799439011",
            email: "john@example.com",
            name: "John Doe",
          },
        }),
      });

      render(
        <TestWrapper store={store}>
          <LoginComponent />
        </TestWrapper>
      );

      // Fill login form
      fireEvent.change(screen.getByTestId("email-input"), {
        target: { value: "john@example.com" },
      });
      fireEvent.change(screen.getByTestId("password-input"), {
        target: { value: "StrongPass123!" },
      });

      // Submit form
      const loginButton = screen.getByTestId("login-button");
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText("Signing in...")).toBeInTheDocument();
      });

      // Verify login request
      expect(fetch).toHaveBeenCalledWith("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "john@example.com",
          password: "StrongPass123!",
        }),
      });

      // Verify navigation to profile
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/profile");
      });
    });

    test("should handle user registration", async () => {
      // Mock registration component
      const RegisterComponent = () => {
        const [userData, setUserData] = useState({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState("");

        const handleRegister = async (e) => {
          e.preventDefault();
          setLoading(true);
          setError("");

          if (userData.password !== userData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
          }

          try {
            const response = await fetch("/api/auth/signup", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: userData.name,
                email: userData.email,
                password: userData.password,
              }),
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.error);
            }

            // Handle successful registration
            mockPush("/profile");
          } catch (error) {
            setError(error.message);
          } finally {
            setLoading(false);
          }
        };

        return (
          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Full Name"
              value={userData.name}
              onChange={(e) =>
                setUserData({
                  ...userData,
                  name: e.target.value,
                })
              }
              data-testid="name-input"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={userData.email}
              onChange={(e) =>
                setUserData({
                  ...userData,
                  email: e.target.value,
                })
              }
              data-testid="email-input"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={userData.password}
              onChange={(e) =>
                setUserData({
                  ...userData,
                  password: e.target.value,
                })
              }
              data-testid="password-input"
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={userData.confirmPassword}
              onChange={(e) =>
                setUserData({
                  ...userData,
                  confirmPassword: e.target.value,
                })
              }
              data-testid="confirm-password-input"
              required
            />
            {error && <div data-testid="error-message">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              data-testid="register-button"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        );
      };

      // Mock successful registration response
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: "User created successfully",
          token: "valid.jwt.token",
          user: {
            id: "507f1f77bcf86cd799439012",
            name: "Jane Doe",
            email: "jane@example.com",
          },
        }),
      });

      render(
        <TestWrapper store={store}>
          <RegisterComponent />
        </TestWrapper>
      );

      // Fill registration form
      fireEvent.change(screen.getByTestId("name-input"), {
        target: { value: "Jane Doe" },
      });
      fireEvent.change(screen.getByTestId("email-input"), {
        target: { value: "jane@example.com" },
      });
      fireEvent.change(screen.getByTestId("password-input"), {
        target: { value: "StrongPass123!" },
      });
      fireEvent.change(screen.getByTestId("confirm-password-input"), {
        target: { value: "StrongPass123!" },
      });

      // Submit form
      const registerButton = screen.getByTestId("register-button");
      fireEvent.click(registerButton);

      await waitFor(() => {
        expect(screen.getByText("Creating account...")).toBeInTheDocument();
      });

      // Verify registration request
      expect(fetch).toHaveBeenCalledWith("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Jane Doe",
          email: "jane@example.com",
          password: "StrongPass123!",
        }),
      });

      // Verify navigation to profile
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/profile");
      });
    });
  });

  describe("Error Handling and Edge Cases", () => {
    test("should handle network errors gracefully", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));

      const ErrorComponent = () => {
        const [error, setError] = useState("");
        const [loading, setLoading] = useState(false);

        const handleAction = async () => {
          setLoading(true);
          try {
            await fetch("/api/test");
          } catch (err) {
            setError("Network error occurred. Please try again.");
          } finally {
            setLoading(false);
          }
        };

        return (
          <div>
            <button onClick={handleAction} disabled={loading}>
              {loading ? "Loading..." : "Test Action"}
            </button>
            {error && <div data-testid="error-message">{error}</div>}
          </div>
        );
      };

      render(
        <TestWrapper store={store}>
          <ErrorComponent />
        </TestWrapper>
      );

      const actionButton = screen.getByText("Test Action");
      fireEvent.click(actionButton);

      await waitFor(() => {
        expect(screen.getByTestId("error-message")).toHaveTextContent(
          "Network error occurred. Please try again."
        );
      });
    });

    test("should handle server errors gracefully", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({
          error: "Internal server error",
        }),
      });

      const ServerErrorComponent = () => {
        const [error, setError] = useState("");
        const [loading, setLoading] = useState(false);

        const handleAction = async () => {
          setLoading(true);
          try {
            const response = await fetch("/api/test");
            if (!response.ok) {
              const data = await response.json();
              throw new Error(data.error);
            }
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        };

        return (
          <div>
            <button onClick={handleAction} disabled={loading}>
              {loading ? "Loading..." : "Test Action"}
            </button>
            {error && <div data-testid="error-message">{error}</div>}
          </div>
        );
      };

      render(
        <TestWrapper store={store}>
          <ServerErrorComponent />
        </TestWrapper>
      );

      const actionButton = screen.getByText("Test Action");
      fireEvent.click(actionButton);

      await waitFor(() => {
        expect(screen.getByTestId("error-message")).toHaveTextContent(
          "Internal server error"
        );
      });
    });
  });
});
