import React from "react";
import {
  FaCheckCircle,
  FaMapMarkerAlt,
  FaCreditCard,
  FaBox,
} from "@/components/icons/Icons";
import Link from "next/link";

const Odersteps = ({ step1, step2, step3 }) => {
  const steps = [
    {
      id: 1,
      title: "Shipping Address",
      shortTitle: "Address",
      icon: FaMapMarkerAlt,
      link: "/products/cart/shippingaddress",
      completed: step1,
    },
    {
      id: 2,
      title: "Payment",
      shortTitle: "Payment",
      icon: FaCreditCard,
      link: "/products/cart/payoder",
      completed: step2,
    },
    {
      id: 3,
      title: "Order Placed",
      shortTitle: "Order",
      icon: FaBox,
      link: "/products/cart/odered",
      completed: step3,
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 sm:py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step */}
            <div className="flex flex-col items-center flex-1">
              <div className="relative">
                {/* Step Circle */}
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    step.completed
                      ? "bg-green-500 border-green-500 text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  }`}
                >
                  {step.completed ? (
                    <FaCheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                  ) : (
                    <step.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </div>

                {/* Step Number (shown when not completed) */}
                {!step.completed && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gray-400 text-white text-xs rounded-full flex items-center justify-center">
                    {step.id}
                  </div>
                )}
              </div>

              {/* Step Title */}
              <div className="mt-2 sm:mt-3 text-center">
                {step.completed ? (
                  <Link
                    href={step.link}
                    className="text-xs sm:text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
                  >
                    <span className="hidden sm:inline">{step.title}</span>
                    <span className="sm:hidden">{step.shortTitle}</span>
                  </Link>
                ) : (
                  <span className="text-xs sm:text-sm font-medium text-gray-500">
                    <span className="hidden sm:inline">{step.title}</span>
                    <span className="sm:hidden">{step.shortTitle}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-2 sm:mx-4">
                <div
                  className={`h-0.5 transition-all duration-300 ${
                    step.completed ? "bg-green-500" : "bg-gray-300"
                  }`}
                ></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mt-4 sm:mt-6">
        <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
          <div
            className="bg-green-500 h-1.5 sm:h-2 rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${
                step1 && step2 && step3
                  ? 100
                  : step1 && step2
                  ? 66.67
                  : step1
                  ? 33.33
                  : 0
              }%`,
            }}
          ></div>
        </div>
      </div>

      {/* Current Step Indicator */}
      <div className="mt-3 sm:mt-4 text-center">
        <span className="text-xs sm:text-sm text-gray-600">
          {!step1 && "Step 1 of 3: Add your shipping address"}
          {step1 && !step2 && "Step 2 of 3: Complete your payment"}
          {step1 && step2 && !step3 && "Step 3 of 3: Review your order"}
          {step1 && step2 && step3 && "Order completed successfully! 🎉"}
        </span>
      </div>
    </div>
  );
};

export default Odersteps;
