import { getSession } from "next-auth/react";

// Get current user session
export const getCurrentUser = async () => {
  try {
    const session = await getSession();
    return session;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = async () => {
  const session = await getCurrentUser();
  return !!session;
};

// Check if user is admin
export const isAdmin = async () => {
  const session = await getCurrentUser();
  return session?.isAdmin || false;
};

// Get user ID from session
export const getUserId = async () => {
  const session = await getCurrentUser();
  return session?.user?.id;
};

// Get user email from session
export const getUserEmail = async () => {
  const session = await getCurrentUser();
  return session?.user?.email;
};

// Check if user has password set
export const hasPassword = async () => {
  const session = await getCurrentUser();
  return session?.hasPassword || false;
};

// Format user data for display
export const formatUserData = (user) => {
  if (!user) return null;

  return {
    id: user.id || user._id,
    name: user.name,
    email: user.email,
    username: user.username,
    image: user.image,
    isAdmin: user.isAdmin,
    emailVerified: user.emailVerified,
    hasPassword: user.hasPassword,
  };
};

// Validate email format
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const validatePassword = (password) => {
  const minLength = 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return {
    isValid: password.length >= minLength,
    hasUpperCase,
    hasLowerCase,
    hasNumbers,
    hasSpecialChar,
    minLength: password.length >= minLength,
  };
};

// Validate username format
export const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  const minLength = 2;
  const maxLength = 30;

  return {
    isValid:
      usernameRegex.test(username) &&
      username.length >= minLength &&
      username.length <= maxLength,
    minLength: username.length >= minLength,
    maxLength: username.length <= maxLength,
    format: usernameRegex.test(username),
  };
};
