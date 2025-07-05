import React, { useState, useEffect } from "react";
import {
  FaCheckCircle,
  FaMapMarkerAlt,
  FaCreditCard,
  FaBox,
  FaSpinner,
} from "@/components/icons/Icons";
import Link from "next/link";

const Odersteps = ({ step1, step2, step3, variant = "default" }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  const steps = [
    {
      id: 1,
      title: "Shipping Address",
      shortTitle: "Address",
      icon: FaMapMarkerAlt,
      link: "/products/cart/shippingaddress",
      completed: step1,
      description: "Enter your delivery details",
    },
    {
      id: 2,
      title: "Payment",
      shortTitle: "Payment",
      icon: FaCreditCard,
      link: "/products/cart/payoder",
      completed: step2,
      description: "Complete your payment",
    },
    {
      id: 3,
      title: "Order Placed",
      shortTitle: "Order",
      icon: FaBox,
      link: "/products/cart/odered",
      completed: step3,
      description: "Order confirmation",
    },
  ];

  useEffect(() => {
    // Determine current step based on completion status
    if (step1 && step2 && step3) {
      setCurrentStep(3);
    } else if (step1 && step2) {
      setCurrentStep(2);
    } else if (step1) {
      setCurrentStep(1);
    } else {
      setCurrentStep(0);
    }
  }, [step1, step2, step3]);

  // Calculate progress percentage
  const getProgressPercentage = () => {
    if (step1 && step2 && step3) return 100;
    if (step1 && step2) return 66.67;
    if (step1) return 33.33;
    return 0;
  };

  // Different stepper variants
  const stepperVariants = {
    default: () => (
      <div className="w-full max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              {/* Step */}
              <div className="flex flex-col items-center flex-1">
                <div className="relative">
                  {/* Step Circle */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ease-out ${
                      step.completed
                        ? "bg-blue-600 border-blue-600 text-white shadow-lg scale-110"
                        : currentStep === step.id
                        ? "bg-blue-100 dark:bg-blue-900 border-blue-500 text-blue-600 dark:text-blue-400 shadow-md"
                        : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    {step.completed ? (
                      <FaCheckCircle className="w-5 h-5 animate-pulse" />
                    ) : currentStep === step.id ? (
                      <FaSpinner className="w-4 h-4 animate-spin" />
                    ) : (
                      <step.icon className="w-4 h-4" />
                    )}
                  </div>

                  {/* Pulse animation for current step */}
                  {currentStep === step.id && !step.completed && (
                    <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20"></div>
                  )}
                </div>

                {/* Step Title */}
                <div className="mt-3 text-center">
                  <span
                    className={`text-sm font-medium transition-colors duration-300 ${
                      step.completed
                        ? "text-blue-600 dark:text-blue-400"
                        : currentStep === step.id
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {step.shortTitle}
                  </span>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 hidden sm:block">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4">
                  <div className="relative h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-700 ease-out rounded-full ${
                        step.completed
                          ? "bg-blue-600"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                      style={{
                        width: step.completed ? "100%" : "0%",
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Enhanced Progress Bar */}
        <div className="mt-6">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-700 ease-out shadow-sm"
              style={{
                width: `${getProgressPercentage()}%`,
              }}
            ></div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {Math.round(getProgressPercentage())}% Complete
            </span>
          </div>
        </div>
      </div>
    ),

    compact: () => (
      <div className="w-full max-w-lg mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    step.completed
                      ? "bg-green-500 border-green-500 text-white"
                      : currentStep === step.id
                      ? "bg-blue-500 border-blue-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500"
                  }`}
                >
                  {step.completed ? (
                    <FaCheckCircle className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-bold">{step.id}</span>
                  )}
                </div>
                <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                  {step.shortTitle}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 mx-2">
                  <div
                    className={`h-0.5 transition-all duration-300 ${
                      step.completed
                        ? "bg-green-500"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  ></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    ),

    vertical: () => (
      <div className="w-full max-w-md mx-auto px-4 py-6">
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-start">
              <div className="flex flex-col items-center mr-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    step.completed
                      ? "bg-blue-600 border-blue-600 text-white"
                      : currentStep === step.id
                      ? "bg-blue-100 dark:bg-blue-900 border-blue-500 text-blue-600"
                      : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400"
                  }`}
                >
                  {step.completed ? (
                    <FaCheckCircle className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-4 h-4" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-0.5 h-8 mt-2 transition-all duration-300 ${
                      step.completed
                        ? "bg-blue-600"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  ></div>
                )}
              </div>
              <div className="flex-1 pt-1">
                <h3
                  className={`text-sm font-medium transition-colors duration-300 ${
                    step.completed
                      ? "text-blue-600 dark:text-blue-400"
                      : currentStep === step.id
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {step.title}
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),

    modern: () => (
      <div className="w-full max-w-3xl mx-auto px-4 py-8">
        <div className="relative">
          {/* Background line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700"></div>

          <div className="flex items-center justify-between relative">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="flex flex-col items-center flex-1 relative"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ease-out relative z-10 ${
                    step.completed
                      ? "bg-gradient-to-r from-green-400 to-green-500 border-green-500 text-white shadow-lg"
                      : currentStep === step.id
                      ? "bg-gradient-to-r from-blue-400 to-blue-500 border-blue-500 text-white shadow-lg"
                      : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400"
                  }`}
                >
                  {step.completed ? (
                    <FaCheckCircle className="w-5 h-5" />
                  ) : currentStep === step.id ? (
                    <FaSpinner className="w-4 h-4 animate-spin" />
                  ) : (
                    <step.icon className="w-4 h-4" />
                  )}
                </div>

                {/* Progress line */}
                {index < steps.length - 1 && (
                  <div className="absolute top-5 left-1/2 w-full h-0.5 bg-gray-200 dark:bg-gray-700">
                    <div
                      className={`h-full transition-all duration-700 ease-out ${
                        step.completed
                          ? "bg-gradient-to-r from-green-400 to-green-500"
                          : "bg-transparent"
                      }`}
                      style={{
                        width: step.completed ? "100%" : "0%",
                      }}
                    ></div>
                  </div>
                )}

                <div className="mt-4 text-center">
                  <span
                    className={`text-sm font-semibold transition-colors duration-300 ${
                      step.completed
                        ? "text-green-600 dark:text-green-400"
                        : currentStep === step.id
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  };

  // Return the selected variant
  return stepperVariants[variant]
    ? stepperVariants[variant]()
    : stepperVariants.default();
};

export default Odersteps;
