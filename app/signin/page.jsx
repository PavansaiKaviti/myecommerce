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
} from "@/components/icons/Icons";
import Link from "next/link";

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
    setError(
      "Email/password sign-in is not available. Please use Google sign-in."
    );
    setIsLoading(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Sign in to your account to continue
          </p>
        </div>

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
          className="w-full flex items-center justify-center gap-3 bg-white dark:bg-white/90 text-gray-700 border-2 border-gray-200 dark:border-white/30 rounded-2xl py-4 px-6 font-semibold hover:bg-gray-50 dark:hover:bg-white hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed mb-6 shadow-lg"
        >
          {isGoogleLoading ? (
            <FaSpinner className="w-5 h-5 animate-spin" />
          ) : (
            <FaGoogle className="w-5 h-5 text-red-500" />
          )}
          {isGoogleLoading ? "Signing in..." : "Continue with Google"}
        </button>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-white/20"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-transparent text-gray-500 dark:text-gray-300 font-medium">
              Or continue with email
            </span>
          </div>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-200"
            >
              Email Address
            </label>
            <div className="relative group">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-purple-400 transition-colors" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField("")}
                className={`w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-white/10 border-2 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 transition-all duration-300 ${
                  focusedField === "email"
                    ? "border-purple-400 focus:ring-purple-500/30"
                    : "border-gray-300 dark:border-white/20 hover:border-gray-400 dark:hover:border-white/30"
                }`}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-200"
            >
              Password
            </label>
            <div className="relative group">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-purple-400 transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField("")}
                className={`w-full pl-10 pr-12 py-3 bg-white/80 dark:bg-white/10 border-2 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 transition-all duration-300 ${
                  focusedField === "password"
                    ? "border-purple-400 focus:ring-purple-500/30"
                    : "border-gray-300 dark:border-white/20 hover:border-gray-400 dark:hover:border-white/30"
                }`}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
              >
                {showPassword ? (
                  <FaEyeSlash className="w-4 h-4" />
                ) : (
                  <FaEye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-4">
              <p className="text-sm text-red-600 dark:text-red-300 font-medium">
                {error}
              </p>
            </div>
          )}

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <Link
              href="#"
              className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] shadow-xl group"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-3">
                <FaSpinner className="w-5 h-5 animate-spin" />
                Signing in...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                Sign In
                <div className="w-4 h-4 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors"></div>
              </div>
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
            <button className="hover:text-gray-700 dark:hover:text-white transition-colors">
              Help
            </button>
            <button className="hover:text-gray-700 dark:hover:text-white transition-colors">
              Privacy
            </button>
            <button className="hover:text-gray-700 dark:hover:text-white transition-colors">
              Terms
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
