import Link from "next/link";
import React from "react";
import {
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaGithub,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "@/components/icons/Icons";

const Footer = () => {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white mt-auto border-t border-gray-800 dark:border-gray-700">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <span className="text-2xl font-bold text-white">DINO</span>
            </div>
            <p className="text-gray-300 dark:text-gray-400 text-sm leading-relaxed">
              Your trusted destination for quality products and exceptional
              shopping experience. We're committed to providing the best service
              to our customers.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://www.facebook.com/"
                className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors"
              >
                <FaFacebook className="text-xl" />
              </Link>
              <Link
                href="https://www.instagram.com/"
                className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors"
              >
                <FaInstagram className="text-xl" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/pavansai-kaviti/"
                className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors"
              >
                <FaLinkedin className="text-xl" />
              </Link>
              <Link
                href="https://github.com/PavansaiKaviti"
                className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors"
              >
                <FaGithub className="text-xl" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors text-sm"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-blue-400 dark:text-blue-300 flex-shrink-0" />
                <Link
                  href="mailto:kavitipavansai@gmail.com"
                  className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors text-sm"
                >
                  kavitipavansai@gmail.com
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <FaPhone className="text-blue-400 dark:text-blue-300 flex-shrink-0" />
                <span className="text-gray-300 dark:text-gray-400 text-sm">
                  +1 (555) 123-4567
                </span>
              </div>
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-blue-400 dark:text-blue-300 flex-shrink-0 mt-1" />
                <span className="text-gray-300 dark:text-gray-400 text-sm">
                  123 Commerce St, Business District, NY 10001
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 dark:text-gray-500 text-sm">
              © 2024 DINO. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link
                href="/privacy"
                className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
