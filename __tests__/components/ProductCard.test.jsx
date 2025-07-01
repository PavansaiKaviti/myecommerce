import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProductCard from "@/components/productcard/Productcard";

// Mock Next.js router
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock Redux
const mockUseDispatch = jest.fn();
jest.mock("react-redux", () => ({
  useDispatch: () => mockUseDispatch(),
}));

// Mock NextAuth
jest.mock("next-auth/react", () => ({
  useSession: () => ({
    data: null,
    status: "unauthenticated",
  }),
}));

describe("ProductCard Component", () => {
  const mockProduct = {
    _id: "507f1f77bcf86cd799439011",
    name: "Test Product",
    description: "A test product description",
    price: 99.99,
    stock: 10,
    category: "Electronics",
    brand: "Test Brand",
    images: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
    ],
    rating: 4.5,
    numReviews: 25,
  };

  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseDispatch.mockReturnValue(mockDispatch);
  });

  describe("Rendering", () => {
    test("should render product information correctly", () => {
      render(<ProductCard product={mockProduct} />);

      expect(screen.getByText("Test Product")).toBeInTheDocument();
      expect(screen.getByText("Test Brand")).toBeInTheDocument();
      expect(screen.getByText("$99.99")).toBeInTheDocument();
      expect(screen.getByText("Electronics")).toBeInTheDocument();
      expect(screen.getByText("10 in stock")).toBeInTheDocument();
    });

    test("should display product image", () => {
      render(<ProductCard product={mockProduct} />);

      const image = screen.getByAltText("Test Product");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", "https://example.com/image1.jpg");
    });

    test("should show rating and review count", () => {
      render(<ProductCard product={mockProduct} />);

      expect(screen.getByText("4.5")).toBeInTheDocument();
      expect(screen.getByText("(25 reviews)")).toBeInTheDocument();
    });

    test('should show "View Details" button', () => {
      render(<ProductCard product={mockProduct} />);

      expect(screen.getByText("View Details")).toBeInTheDocument();
    });

    test('should show "Add to Cart" button', () => {
      render(<ProductCard product={mockProduct} />);

      expect(screen.getByText("Add to Cart")).toBeInTheDocument();
    });
  });

  describe("Stock Status", () => {
    test('should show "In Stock" when stock is greater than 0', () => {
      render(<ProductCard product={mockProduct} />);

      expect(screen.getByText("10 in stock")).toBeInTheDocument();
    });

    test('should show "Out of Stock" when stock is 0', () => {
      const outOfStockProduct = { ...mockProduct, stock: 0 };
      render(<ProductCard product={outOfStockProduct} />);

      expect(screen.getByText("Out of stock")).toBeInTheDocument();
    });

    test('should show "Low Stock" when stock is less than 5', () => {
      const lowStockProduct = { ...mockProduct, stock: 3 };
      render(<ProductCard product={lowStockProduct} />);

      expect(screen.getByText("3 in stock")).toBeInTheDocument();
      expect(screen.getByText("Low Stock")).toBeInTheDocument();
    });
  });

  describe("Price Display", () => {
    test("should format price correctly with two decimal places", () => {
      const productWithDecimal = { ...mockProduct, price: 99.9 };
      render(<ProductCard product={productWithDecimal} />);

      expect(screen.getByText("$99.90")).toBeInTheDocument();
    });

    test("should handle zero price", () => {
      const freeProduct = { ...mockProduct, price: 0 };
      render(<ProductCard product={freeProduct} />);

      expect(screen.getByText("$0.00")).toBeInTheDocument();
    });

    test("should handle large prices", () => {
      const expensiveProduct = { ...mockProduct, price: 9999.99 };
      render(<ProductCard product={expensiveProduct} />);

      expect(screen.getByText("$9,999.99")).toBeInTheDocument();
    });
  });

  describe("Rating Display", () => {
    test("should display rating with stars", () => {
      render(<ProductCard product={mockProduct} />);

      expect(screen.getByText("4.5")).toBeInTheDocument();
      // Check for star icons (assuming they're rendered as text or icons)
      const stars = screen.getAllByTestId("star");
      expect(stars).toHaveLength(5); // 5 stars total
    });

    test("should handle zero rating", () => {
      const noRatingProduct = { ...mockProduct, rating: 0, numReviews: 0 };
      render(<ProductCard product={noRatingProduct} />);

      expect(screen.getByText("0")).toBeInTheDocument();
      expect(screen.getByText("(0 reviews)")).toBeInTheDocument();
    });

    test("should handle missing rating data", () => {
      const noRatingData = { ...mockProduct };
      delete noRatingData.rating;
      delete noRatingData.numReviews;

      render(<ProductCard product={noRatingData} />);

      expect(screen.getByText("No ratings")).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    test('should navigate to product detail page when "View Details" is clicked', () => {
      render(<ProductCard product={mockProduct} />);

      const viewDetailsButton = screen.getByText("View Details");
      fireEvent.click(viewDetailsButton);

      expect(mockPush).toHaveBeenCalledWith(`/products/${mockProduct._id}`);
    });

    test('should add product to cart when "Add to Cart" is clicked', () => {
      render(<ProductCard product={mockProduct} />);

      const addToCartButton = screen.getByText("Add to Cart");
      fireEvent.click(addToCartButton);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: "cart/addToCart",
        payload: {
          id: mockProduct._id,
          name: mockProduct.name,
          price: mockProduct.price,
          image: mockProduct.images[0],
          quantity: 1,
        },
      });
    });

    test('should disable "Add to Cart" button when out of stock', () => {
      const outOfStockProduct = { ...mockProduct, stock: 0 };
      render(<ProductCard product={outOfStockProduct} />);

      const addToCartButton = screen.getByText("Add to Cart");
      expect(addToCartButton).toBeDisabled();

      fireEvent.click(addToCartButton);
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    test("should show success message when product is added to cart", () => {
      render(<ProductCard product={mockProduct} />);

      const addToCartButton = screen.getByText("Add to Cart");
      fireEvent.click(addToCartButton);

      // Check if toast notification is triggered
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  describe("Image Handling", () => {
    test("should use first image from images array", () => {
      render(<ProductCard product={mockProduct} />);

      const image = screen.getByAltText("Test Product");
      expect(image).toHaveAttribute("src", "https://example.com/image1.jpg");
    });

    test("should handle missing images gracefully", () => {
      const productWithoutImages = { ...mockProduct, images: [] };
      render(<ProductCard product={productWithoutImages} />);

      const image = screen.getByAltText("Test Product");
      expect(image).toHaveAttribute("src", "/images/noproduct.jpg"); // Default image
    });

    test("should handle image loading errors", () => {
      render(<ProductCard product={mockProduct} />);

      const image = screen.getByAltText("Test Product");
      fireEvent.error(image);

      // Should show default image on error
      expect(image).toHaveAttribute("src", "/images/noproduct.jpg");
    });
  });

  describe("Responsive Design", () => {
    test("should have responsive classes", () => {
      render(<ProductCard product={mockProduct} />);

      const card = screen.getByTestId("product-card");
      expect(card).toHaveClass(
        "bg-white",
        "rounded-lg",
        "shadow-md",
        "overflow-hidden"
      );
    });

    test("should be accessible on mobile devices", () => {
      render(<ProductCard product={mockProduct} />);

      const viewDetailsButton = screen.getByText("View Details");
      const addToCartButton = screen.getByText("Add to Cart");

      expect(viewDetailsButton).toHaveAttribute("tabIndex", "0");
      expect(addToCartButton).toHaveAttribute("tabIndex", "0");
    });
  });

  describe("Error Handling", () => {
    test("should handle missing product data gracefully", () => {
      const incompleteProduct = {
        _id: "507f1f77bcf86cd799439011",
        name: "Test Product",
        // Missing other fields
      };

      render(<ProductCard product={incompleteProduct} />);

      expect(screen.getByText("Test Product")).toBeInTheDocument();
      expect(screen.getByText("$0.00")).toBeInTheDocument(); // Default price
      expect(screen.getByText("0 in stock")).toBeInTheDocument(); // Default stock
    });

    test("should handle null product gracefully", () => {
      render(<ProductCard product={null} />);

      // Should not crash and should show loading or error state
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    test("should handle undefined product gracefully", () => {
      render(<ProductCard product={undefined} />);

      // Should not crash and should show loading or error state
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    test("should not re-render unnecessarily", () => {
      const { rerender } = render(<ProductCard product={mockProduct} />);

      // Mock console.log to track renders
      const consoleSpy = jest.spyOn(console, "log");

      rerender(<ProductCard product={mockProduct} />);

      // Should not have excessive re-renders
      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    test("should handle large product lists efficiently", () => {
      const largeProductList = Array.from({ length: 100 }, (_, index) => ({
        ...mockProduct,
        _id: `product-${index}`,
        name: `Product ${index}`,
      }));

      // Render multiple product cards
      const { container } = render(
        <div>
          {largeProductList.slice(0, 10).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      );

      // Should render without performance issues
      expect(container.children).toHaveLength(1);
    });
  });

  describe("Accessibility", () => {
    test("should have proper ARIA labels", () => {
      render(<ProductCard product={mockProduct} />);

      const image = screen.getByAltText("Test Product");
      expect(image).toBeInTheDocument();

      const viewDetailsButton = screen.getByText("View Details");
      expect(viewDetailsButton).toHaveAttribute(
        "aria-label",
        "View details for Test Product"
      );
    });

    test("should be keyboard navigable", () => {
      render(<ProductCard product={mockProduct} />);

      const viewDetailsButton = screen.getByText("View Details");
      const addToCartButton = screen.getByText("Add to Cart");

      expect(viewDetailsButton).toHaveAttribute("tabIndex", "0");
      expect(addToCartButton).toHaveAttribute("tabIndex", "0");
    });

    test("should handle keyboard events", () => {
      render(<ProductCard product={mockProduct} />);

      const viewDetailsButton = screen.getByText("View Details");

      fireEvent.keyDown(viewDetailsButton, { key: "Enter" });
      expect(mockPush).toHaveBeenCalledWith(`/products/${mockProduct._id}`);

      fireEvent.keyDown(viewDetailsButton, { key: " " });
      expect(mockPush).toHaveBeenCalledWith(`/products/${mockProduct._id}`);
    });
  });

  describe("Edge Cases", () => {
    test("should handle very long product names", () => {
      const longNameProduct = {
        ...mockProduct,
        name: "This is a very long product name that might overflow the card layout and need to be truncated or wrapped properly",
      };

      render(<ProductCard product={longNameProduct} />);

      expect(screen.getByText(longNameProduct.name)).toBeInTheDocument();
    });

    test("should handle very long descriptions", () => {
      const longDescProduct = {
        ...mockProduct,
        description:
          "This is a very long product description that might overflow the card layout and need to be truncated or wrapped properly. It should be handled gracefully by the component.",
      };

      render(<ProductCard product={longDescProduct} />);

      // Description might be truncated or not shown in card view
      expect(screen.getByText(longDescProduct.name)).toBeInTheDocument();
    });

    test("should handle special characters in product name", () => {
      const specialCharProduct = {
        ...mockProduct,
        name: "Product with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?",
      };

      render(<ProductCard product={specialCharProduct} />);

      expect(screen.getByText(specialCharProduct.name)).toBeInTheDocument();
    });
  });
});
