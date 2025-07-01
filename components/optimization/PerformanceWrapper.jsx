"use client";
import { memo, Suspense, lazy } from "react";
import Loadingpage from "@/app/loading";

/**
 * Performance wrapper for components that need lazy loading
 */
export const withLazyLoading = (
  Component,
  fallback = <Loadingpage size={50} />
) => {
  const LazyComponent = lazy(() => Promise.resolve({ default: Component }));

  return (props) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

/**
 * Memoized component wrapper for expensive components
 */
export const withMemo = (Component, propsAreEqual = null) => {
  return memo(Component, propsAreEqual);
};

/**
 * Performance wrapper that combines lazy loading and memoization
 */
export const withPerformanceOptimization = (Component, options = {}) => {
  const {
    lazy = false,
    memo = false,
    fallback = <Loadingpage size={50} />,
    propsAreEqual = null,
  } = options;

  let OptimizedComponent = Component;

  if (memo) {
    OptimizedComponent = withMemo(OptimizedComponent, propsAreEqual);
  }

  if (lazy) {
    OptimizedComponent = withLazyLoading(OptimizedComponent, fallback);
  }

  return OptimizedComponent;
};
