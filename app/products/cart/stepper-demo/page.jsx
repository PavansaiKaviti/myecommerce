"use client";
import React, { useState } from "react";
import Odersteps from "@/components/odersteps/Odersteps";

const StepperDemo = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState("default");

  const variants = [
    { name: "default", label: "Default" },
    { name: "compact", label: "Compact" },
    { name: "vertical", label: "Vertical" },
    { name: "modern", label: "Modern" },
  ];

  const stepStates = [
    { step1: false, step2: false, step3: false, label: "Step 1" },
    { step1: true, step2: false, step3: false, label: "Step 2" },
    { step1: true, step2: true, step3: false, label: "Step 3" },
    { step1: true, step2: true, step3: true, label: "Complete" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Stepper Component Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Explore different stepper variants and states
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Variant Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Select Variant
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {variants.map((variant) => (
                  <button
                    key={variant.name}
                    onClick={() => setSelectedVariant(variant.name)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedVariant === variant.name
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {variant.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Select Step
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {stepStates.map((state, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index + 1)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentStep === index + 1
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {state.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stepper Display */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {variants.find((v) => v.name === selectedVariant)?.label} Variant
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Current Step: {stepStates[currentStep - 1]?.label}
            </p>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-900">
            <Odersteps
              step1={stepStates[currentStep - 1]?.step1}
              step2={stepStates[currentStep - 1]?.step2}
              step3={stepStates[currentStep - 1]?.step3}
              variant={selectedVariant}
            />
          </div>
        </div>

        {/* Variant Descriptions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {variants.map((variant) => (
            <div
              key={variant.name}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                {variant.label}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {variant.name === "default" &&
                  "Enhanced default stepper with animations and progress bar"}
                {variant.name === "compact" &&
                  "Minimal stepper with smaller circles and simplified design"}
                {variant.name === "vertical" &&
                  "Vertical layout with step descriptions and icons"}
                {variant.name === "modern" &&
                  "Modern design with gradients and advanced animations"}
              </p>
              <button
                onClick={() => setSelectedVariant(variant.name)}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Try {variant.label}
              </button>
            </div>
          ))}
        </div>

        {/* Features List */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Stepper Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Multiple visual variants
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Smooth animations and transitions
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Progress percentage display
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Dark mode support
              </li>
            </ul>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Responsive design
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Loading states with spinners
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Pulse animations for current step
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Gradient backgrounds
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepperDemo;
