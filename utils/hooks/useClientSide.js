"use client";
import { useState, useEffect } from "react";

/**
 * Custom hook to handle client-side hydration
 * Prevents hydration mismatches by ensuring components only render on client
 */
export const useClientSide = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
};

/**
 * Custom hook for session-aware client-side rendering
 * Combines useSession with client-side check
 */
export const useSessionClient = () => {
  const { data: session, status } = require("next-auth/react").useSession();
  const isClient = useClientSide();

  return {
    session,
    status,
    isClient,
    isReady: isClient && status !== "loading",
  };
};
