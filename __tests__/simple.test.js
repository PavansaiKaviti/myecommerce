import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Simple test component
const TestComponent = ({ title, children }) => (
  <div>
    <h1>{title}</h1>
    <p>{children}</p>
  </div>
);

describe("Simple Component Tests", () => {
  test("should render component with props", () => {
    render(<TestComponent title="Test Title">Test content</TestComponent>);

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  test("should handle different props", () => {
    render(
      <TestComponent title="Another Title">Another content</TestComponent>
    );

    expect(screen.getByText("Another Title")).toBeInTheDocument();
    expect(screen.getByText("Another content")).toBeInTheDocument();
  });
});

describe("Utility Function Tests", () => {
  test("should format price correctly", () => {
    const formatPrice = (price) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);
    };

    expect(formatPrice(99.99)).toBe("$99.99");
    expect(formatPrice(0)).toBe("$0.00");
    expect(formatPrice(1000)).toBe("$1,000.00");
  });

  test("should validate email format", () => {
    const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    expect(validateEmail("test@example.com")).toBe(true);
    expect(validateEmail("invalid-email")).toBe(false);
    expect(validateEmail("")).toBe(false);
    expect(validateEmail("test@")).toBe(false);
  });

  test("should sanitize input", () => {
    const sanitizeInput = (input) => {
      if (typeof input !== "string") return "";
      return input
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;");
    };

    expect(sanitizeInput('<script>alert("xss")</script>')).toBe(
      "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
    );
    expect(sanitizeInput("Safe text")).toBe("Safe text");
    expect(sanitizeInput(null)).toBe("");
    expect(sanitizeInput(undefined)).toBe("");
  });
});

describe("API Mock Tests", () => {
  test("should mock fetch requests", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: "test data" }),
    });

    const response = await fetch("/api/test");
    const data = await response.json();

    expect(data.data).toBe("test data");
    expect(fetch).toHaveBeenCalledWith("/api/test");
  });

  test("should handle fetch errors", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network error"));

    await expect(fetch("/api/error")).rejects.toThrow("Network error");
  });
});

describe("Security Tests", () => {
  test("should prevent XSS in user input", () => {
    const sanitizeInput = (input) => {
      if (typeof input !== "string") return "";
      return input
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;");
    };

    const maliciousInput = '<script>alert("xss")</script>';
    const sanitized = sanitizeInput(maliciousInput);

    expect(sanitized).not.toContain("<script>");
    expect(sanitized).toContain("&lt;script&gt;");
  });

  test("should validate password strength", () => {
    const validatePassword = (password) => {
      if (!password || password.length < 8) return false;

      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumbers = /\d/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
    };

    expect(validatePassword("StrongPass123!")).toBe(true);
    expect(validatePassword("weak")).toBe(false);
    expect(validatePassword("12345678")).toBe(false);
    expect(validatePassword("NoSpecialChar123")).toBe(false);
  });
});
