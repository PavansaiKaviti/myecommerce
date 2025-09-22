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
  FaUser,
  FaArrowRight,
  FaCheck,
  FaTimes,
} from "@/components/icons/Icons";
import Link from "next/link";
import Image from "next/image";

const SignUp = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [focusedField, setFocusedField] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: "",
  });

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

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let score = 0;
    let feedback = [];

    if (password.length >= 8) score++;
    else feedback.push("At least 8 characters");

    if (/[a-z]/.test(password)) score++;
    else feedback.push("Include lowercase letter");

    if (/[A-Z]/.test(password)) score++;
    else feedback.push("Include uppercase letter");

    if (/[0-9]/.test(password)) score++;
    else feedback.push("Include number");

    if (/[^A-Za-z0-9]/.test(password)) score++;
    else feedback.push("Include special character");

    return {
      score,
      feedback: feedback.join(", "),
    };
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setFormData({ ...formData, password });
    setPasswordStrength(checkPasswordStrength(password));
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      setError("");
      const result = await signIn("google", {
        callbackUrl: callbackUrl,
        redirect: false,
      });

      if (result?.error) {
        setError("Failed to sign up with Google. Please try again.");
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
    setSuccess("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (passwordStrength.score < 3) {
      setError("Password is too weak. Please choose a stronger password.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          username: formData.username,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Account created successfully! Redirecting to login...");
        // Sign in the user automatically
        const signInResult = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (signInResult?.ok) {
          router.push(callbackUrl);
        } else {
          router.push("/signin");
        }
      } else {
        setError(data.error || "Failed to create account");
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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="flex min-h-screen">
        {/* Left side - Form */}
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Create your account
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Or{" "}
                <Link
                  href="/signin"
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  sign in to your account
                </Link>
              </p>
            </div>

            <div className="mt-8">
              <div className="mt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Success Message */}
                  {success && (
                    <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4">
                      <div className="flex">
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                            {success}
                          </h3>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Google Sign Up */}
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
                        ? "Signing up..."
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

                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
                    >
                      Full name
                    </label>
                    <div className="mt-2">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField("")}
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-3 px-4 text-gray-900 dark:text-white shadow-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 sm:text-sm border"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  {/* Username */}
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
                    >
                      Username
                    </label>
                    <div className="mt-2">
                      <input
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        required
                        value={formData.username}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("username")}
                        onBlur={() => setFocusedField("")}
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-3 px-4 text-gray-900 dark:text-white shadow-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 sm:text-sm border"
                        placeholder="Choose a username"
                      />
                    </div>
                  </div>

                  {/* Email Address */}
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

                  {/* Password */}
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
                          autoComplete="new-password"
                          required
                          value={formData.password}
                          onChange={handlePasswordChange}
                          onFocus={() => setFocusedField("password")}
                          onBlur={() => setFocusedField("")}
                          className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-3 px-4 pr-12 text-gray-900 dark:text-white shadow-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 sm:text-sm border"
                          placeholder="Create a password"
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

                      {/* Password Strength Indicator */}
                      {formData.password && (
                        <div className="mt-2">
                          <div className="flex gap-1 mb-1">
                            {[1, 2, 3, 4, 5].map((level) => (
                              <div
                                key={level}
                                className={`h-1 flex-1 rounded ${
                                  level <= passwordStrength.score
                                    ? level <= 2
                                      ? "bg-red-500"
                                      : level <= 3
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                    : "bg-gray-200 dark:bg-gray-700"
                                }`}
                              />
                            ))}
                          </div>
                          <p
                            className={`text-xs ${
                              passwordStrength.score <= 2
                                ? "text-red-500"
                                : passwordStrength.score <= 3
                                ? "text-yellow-500"
                                : "text-green-500"
                            }`}
                          >
                            {passwordStrength.feedback || "Password strength"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
                    >
                      Confirm password
                    </label>
                    <div className="mt-2">
                      <div className="relative">
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          autoComplete="new-password"
                          required
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          onFocus={() => setFocusedField("confirmPassword")}
                          onBlur={() => setFocusedField("")}
                          className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-3 px-4 pr-12 text-gray-900 dark:text-white shadow-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 sm:text-sm border"
                          placeholder="Confirm your password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showConfirmPassword ? (
                            <FaEyeSlash className="h-4 w-4" />
                          ) : (
                            <FaEye className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      {/* Password Match Indicator */}
                      {formData.confirmPassword && (
                        <div className="flex items-center gap-2 mt-2">
                          {formData.password === formData.confirmPassword ? (
                            <FaCheck className="w-3 h-3 text-green-500" />
                          ) : (
                            <FaTimes className="w-3 h-3 text-red-500" />
                          )}
                          <span
                            className={`text-xs ${
                              formData.password === formData.confirmPassword
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {formData.password === formData.confirmPassword
                              ? "Passwords match"
                              : "Passwords don't match"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="terms"
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-800"
                      required
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm text-gray-900 dark:text-white"
                    >
                      I agree to the{" "}
                      <Link
                        href="#"
                        className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 underline"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="#"
                        className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 underline"
                      >
                        Privacy Policy
                      </Link>
                    </label>
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
                          Creating account...
                        </div>
                      ) : (
                        "Create account"
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
              src="/images/tech.jpg"
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

export default SignUp;
