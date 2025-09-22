"use client";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaGoogle,
  FaSpinner,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaKey,
} from "@/components/icons/Icons";
import Link from "next/link";
import Image from "next/image";

const SignIn = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState("");
  const [showAddPassword, setShowAddPassword] = useState(false);
  const [addPasswordData, setAddPasswordData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showAddPasswordForm, setShowAddPasswordForm] = useState(false);

  useEffect(() => {
    // Check if user is already signed in
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        router.push(callbackUrl);
      }
    };
    checkSession();
  }, [router, callbackUrl]);

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      setError("");
      const result = await signIn("google", {
        callbackUrl: callbackUrl,
        redirect: false,
      });

      if (result?.error) {
        setError("Failed to sign in with Google. Please try again.");
      } else if (result?.ok) {
        router.push(callbackUrl);
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        // Check if it's a Google-only account error
        if (result.error.includes("Google")) {
          setError(result.error);
          setShowAddPasswordForm(true);
        } else {
          setError(result.error);
        }
      } else if (result?.ok) {
        router.push(callbackUrl);
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (addPasswordData.password !== addPasswordData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/add-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: addPasswordData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Sign in the user automatically
        const signInResult = await signIn("credentials", {
          email: formData.email,
          password: addPasswordData.password,
          redirect: false,
        });

        if (signInResult?.ok) {
          router.push(callbackUrl);
        } else {
          router.push("/signin");
        }
      } else {
        setError(data.error || "Failed to add password");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddPasswordChange = (e) => {
    setAddPasswordData({
      ...addPasswordData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="flex min-h-screen">
        {/* Left side - Form */}
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Sign in to your account
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Or{" "}
                <Link
                  href="/signup"
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  create a new account
                </Link>
              </p>
            </div>

            <div className="mt-8">
              <div className="mt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Google Sign In */}
                  <div>
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={isGoogleLoading}
                      className="flex w-full items-center justify-center gap-3 rounded-md bg-white dark:bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus-visible:ring-transparent transition-colors"
                    >
                      {isGoogleLoading ? (
                        <FaSpinner className="h-5 w-5 animate-spin" />
                      ) : (
                        <FaGoogle className="h-5 w-5" />
                      )}
                      {isGoogleLoading
                        ? "Signing in..."
                        : "Continue with Google"}
                    </button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
                      <div className="flex">
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                            {error}
                          </h3>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Add Password Form for Google Users */}
                  {showAddPasswordForm && (
                    <div className="rounded-md bg-blue-50 dark:bg-blue-900/20 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <FaKey className="h-5 w-5 text-blue-400" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                            Link Your Account
                          </h3>
                          <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                            <p>
                              This account was created with Google. Add a
                              password to enable email/password login as well.
                            </p>
                          </div>
                          <form
                            onSubmit={handleAddPassword}
                            className="mt-4 space-y-4"
                          >
                            <div>
                              <label
                                htmlFor="new-password"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                              >
                                Create Password
                              </label>
                              <input
                                type="password"
                                id="new-password"
                                name="password"
                                value={addPasswordData.password}
                                onChange={handleAddPasswordChange}
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 sm:text-sm px-4 py-3"
                                placeholder="Enter new password"
                                required
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="confirm-password"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                              >
                                Confirm Password
                              </label>
                              <input
                                type="password"
                                id="confirm-password"
                                name="confirmPassword"
                                value={addPasswordData.confirmPassword}
                                onChange={handleAddPasswordChange}
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 sm:text-sm px-4 py-3"
                                placeholder="Confirm new password"
                                required
                              />
                            </div>
                            <button
                              type="submit"
                              disabled={isLoading}
                              className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
                            >
                              {isLoading
                                ? "Adding password..."
                                : "Add Password"}
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
                    >
                      Email address
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField("")}
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-3 px-4 text-gray-900 dark:text-white shadow-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 sm:text-sm border"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
                    >
                      Password
                    </label>
                    <div className="mt-2">
                      <div className="relative">
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          required
                          value={formData.password}
                          onChange={handleInputChange}
                          onFocus={() => setFocusedField("password")}
                          onBlur={() => setFocusedField("")}
                          className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-3 px-4 pr-12 text-gray-900 dark:text-white shadow-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 sm:text-sm border"
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showPassword ? (
                            <FaEyeSlash className="h-4 w-4" />
                          ) : (
                            <FaEye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-800"
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-2 block text-sm text-gray-900 dark:text-white"
                      >
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm">
                      <Link
                        href="#"
                        className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <FaSpinner className="h-4 w-4 animate-spin" />
                          Signing in...
                        </div>
                      ) : (
                        "Sign in"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="relative hidden w-0 flex-1 lg:block">
          <div className="absolute inset-0 h-full w-full">
            <Image
              src="/images/apple.jpg"
              alt="DINO Shopping"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-4xl font-bold mb-4">DINO</h1>
                <p className="text-xl opacity-90">
                  Your trusted shopping destination
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
