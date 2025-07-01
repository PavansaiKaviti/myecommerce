import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Navbar from "@/components/navbar/Navbar";

// Mock NextAuth
const mockUseSession = jest.fn();
jest.mock("next-auth/react", () => ({
  useSession: () => mockUseSession(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

// Mock Redux
const mockUseSelector = jest.fn();
const mockUseDispatch = jest.fn();
jest.mock("react-redux", () => ({
  useSelector: () => mockUseSelector(),
  useDispatch: () => mockUseDispatch(),
}));

// Mock Next.js router
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    pathname: "/",
  }),
  usePathname: () => "/",
}));

describe("Navbar Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSession.mockReturnValue({
      data: null,
      status: "unauthenticated",
    });
    mockUseSelector.mockReturnValue([]);
    mockUseDispatch.mockReturnValue(jest.fn());
  });

  describe("Rendering", () => {
    test("should render navbar with logo and navigation links", () => {
      render(<Navbar />);

      expect(screen.getByText("MyEcommerce")).toBeInTheDocument();
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Products")).toBeInTheDocument();
      expect(screen.getByText("Cart")).toBeInTheDocument();
    });

    test("should show cart icon with item count", () => {
      mockUseSelector.mockReturnValue([
        { id: "1", name: "Product 1", quantity: 2 },
        { id: "2", name: "Product 2", quantity: 1 },
      ]);

      render(<Navbar />);

      expect(screen.getByText("3")).toBeInTheDocument(); // Total items: 2 + 1
    });

    test("should show login button when user is not authenticated", () => {
      render(<Navbar />);

      expect(screen.getByText("Login")).toBeInTheDocument();
      expect(screen.queryByText("Profile")).not.toBeInTheDocument();
    });

    test("should show profile button when user is authenticated", () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            name: "John Doe",
            email: "john@example.com",
            image: "https://example.com/avatar.jpg",
          },
        },
        status: "authenticated",
      });

      render(<Navbar />);

      expect(screen.getByText("Profile")).toBeInTheDocument();
      expect(screen.queryByText("Login")).not.toBeInTheDocument();
    });

    test("should show admin link when user is admin", () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            name: "Admin User",
            email: "admin@example.com",
            role: "admin",
          },
        },
        status: "authenticated",
      });

      render(<Navbar />);

      expect(screen.getByText("Admin")).toBeInTheDocument();
    });

    test("should not show admin link when user is not admin", () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            name: "Regular User",
            email: "user@example.com",
            role: "user",
          },
        },
        status: "authenticated",
      });

      render(<Navbar />);

      expect(screen.queryByText("Admin")).not.toBeInTheDocument();
    });
  });

  describe("Navigation", () => {
    test("should navigate to home page when logo is clicked", () => {
      render(<Navbar />);

      const logo = screen.getByText("MyEcommerce");
      fireEvent.click(logo);

      expect(mockPush).toHaveBeenCalledWith("/");
    });

    test("should navigate to products page when products link is clicked", () => {
      render(<Navbar />);

      const productsLink = screen.getByText("Products");
      fireEvent.click(productsLink);

      expect(mockPush).toHaveBeenCalledWith("/products");
    });

    test("should navigate to cart page when cart link is clicked", () => {
      render(<Navbar />);

      const cartLink = screen.getByText("Cart");
      fireEvent.click(cartLink);

      expect(mockPush).toHaveBeenCalledWith("/products/cart");
    });

    test("should navigate to admin page when admin link is clicked", () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            name: "Admin User",
            email: "admin@example.com",
            role: "admin",
          },
        },
        status: "authenticated",
      });

      render(<Navbar />);

      const adminLink = screen.getByText("Admin");
      fireEvent.click(adminLink);

      expect(mockPush).toHaveBeenCalledWith("/profile/admin");
    });

    test("should navigate to profile page when profile link is clicked", () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            name: "John Doe",
            email: "john@example.com",
          },
        },
        status: "authenticated",
      });

      render(<Navbar />);

      const profileLink = screen.getByText("Profile");
      fireEvent.click(profileLink);

      expect(mockPush).toHaveBeenCalledWith("/profile");
    });
  });

  describe("Mobile Menu", () => {
    test("should show mobile menu button on small screens", () => {
      render(<Navbar />);

      const menuButton = screen.getByLabelText("Open menu");
      expect(menuButton).toBeInTheDocument();
    });

    test("should toggle mobile menu when menu button is clicked", () => {
      render(<Navbar />);

      const menuButton = screen.getByLabelText("Open menu");
      fireEvent.click(menuButton);

      // Menu should be open
      expect(screen.getByLabelText("Close menu")).toBeInTheDocument();

      // Click again to close
      const closeButton = screen.getByLabelText("Close menu");
      fireEvent.click(closeButton);

      // Menu should be closed
      expect(screen.getByLabelText("Open menu")).toBeInTheDocument();
    });

    test("should show navigation links in mobile menu", () => {
      render(<Navbar />);

      const menuButton = screen.getByLabelText("Open menu");
      fireEvent.click(menuButton);

      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Products")).toBeInTheDocument();
      expect(screen.getByText("Cart")).toBeInTheDocument();
    });
  });

  describe("Authentication States", () => {
    test("should show loading state when session is loading", () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "loading",
      });

      render(<Navbar />);

      // Should not show login or profile buttons while loading
      expect(screen.queryByText("Login")).not.toBeInTheDocument();
      expect(screen.queryByText("Profile")).not.toBeInTheDocument();
    });

    test("should handle session error gracefully", () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "error",
      });

      render(<Navbar />);

      // Should show login button as fallback
      expect(screen.getByText("Login")).toBeInTheDocument();
    });
  });

  describe("Cart Functionality", () => {
    test("should show empty cart when no items", () => {
      mockUseSelector.mockReturnValue([]);

      render(<Navbar />);

      const cartLink = screen.getByText("Cart");
      expect(cartLink).toBeInTheDocument();

      // Should not show cart count badge
      expect(screen.queryByText("0")).not.toBeInTheDocument();
    });

    test("should show correct cart count with multiple items", () => {
      mockUseSelector.mockReturnValue([
        { id: "1", name: "Product 1", quantity: 3 },
        { id: "2", name: "Product 2", quantity: 2 },
        { id: "3", name: "Product 3", quantity: 1 },
      ]);

      render(<Navbar />);

      expect(screen.getByText("6")).toBeInTheDocument(); // Total: 3 + 2 + 1
    });

    test("should handle cart items with zero quantity", () => {
      mockUseSelector.mockReturnValue([
        { id: "1", name: "Product 1", quantity: 0 },
        { id: "2", name: "Product 2", quantity: 2 },
      ]);

      render(<Navbar />);

      expect(screen.getByText("2")).toBeInTheDocument(); // Only count items with quantity > 0
    });
  });

  describe("Active Link Styling", () => {
    test("should highlight active link based on current path", () => {
      // Mock current pathname
      jest.doMock("next/navigation", () => ({
        useRouter: () => ({
          push: mockPush,
          pathname: "/products",
        }),
        usePathname: () => "/products",
      }));

      render(<Navbar />);

      const productsLink = screen.getByText("Products");
      expect(productsLink).toHaveClass(
        "bg-blue-50",
        "text-blue-600",
        "border-blue-200"
      );
    });

    test("should not highlight inactive links", () => {
      render(<Navbar />);

      const homeLink = screen.getByText("Home");
      expect(homeLink).not.toHaveClass(
        "bg-blue-50",
        "text-blue-600",
        "border-blue-200"
      );
    });
  });

  describe("Accessibility", () => {
    test("should have proper ARIA labels", () => {
      render(<Navbar />);

      expect(screen.getByLabelText("Open menu")).toBeInTheDocument();
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });

    test("should be keyboard navigable", () => {
      render(<Navbar />);

      const homeLink = screen.getByText("Home");
      const productsLink = screen.getByText("Products");

      expect(homeLink).toHaveAttribute("tabIndex", "0");
      expect(productsLink).toHaveAttribute("tabIndex", "0");
    });

    test("should handle keyboard events", () => {
      render(<Navbar />);

      const homeLink = screen.getByText("Home");

      fireEvent.keyDown(homeLink, { key: "Enter" });
      expect(mockPush).toHaveBeenCalledWith("/");

      fireEvent.keyDown(homeLink, { key: " " });
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  describe("Error Handling", () => {
    test("should handle missing user data gracefully", () => {
      mockUseSession.mockReturnValue({
        data: {
          user: null,
        },
        status: "authenticated",
      });

      render(<Navbar />);

      // Should not crash and should show login button as fallback
      expect(screen.getByText("Login")).toBeInTheDocument();
    });

    test("should handle missing cart data gracefully", () => {
      mockUseSelector.mockReturnValue(null);

      render(<Navbar />);

      // Should not crash and should show cart link without count
      expect(screen.getByText("Cart")).toBeInTheDocument();
      expect(screen.queryByText("0")).not.toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    test("should not re-render unnecessarily", () => {
      const { rerender } = render(<Navbar />);

      // Mock console.log to track renders
      const consoleSpy = jest.spyOn(console, "log");

      rerender(<Navbar />);

      // Should not have excessive re-renders
      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });
});
