"use client";

import React, { useState } from "react";
import Link from "next/link";
import WalletConnectButton from "./WalletConnectButton";
import { motion, AnimatePresence } from "framer-motion";
import TestModeToggle from "./TestModeToggle";

/**
 * Header component providing navigation and wallet connection
 * Features responsive design with mobile menu and animated transitions
 * @returns {React.ReactElement} Header component
 */
const Header = () => {
  // State for mobile menu visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-purple-100/80 border-b border-purple-200">
      <nav className="flex justify-between container mx-auto p-6">
        {/* Left Section: Logo and Navigation */}
        <div className="flex gap-8 items-center">
          {/* Logo with hover animation */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center"
          >
            <Link
              href={"/"}
              className="text-3xl pb-1 font-bold bg-gradient-to-r from-purple-800 to-purple-600 bg-clip-text text-transparent"
            >
              Core
            </Link>
          </motion.div>

          {/* Mobile Menu Toggle Button */}
          <motion.button
            className="lg:hidden p-2 rounded-lg hover:bg-purple-200/50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            whileTap={{ scale: 0.9 }}
          >
            <svg
              className="w-6 h-6 text-purple-800"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </motion.button>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex gap-8 items-center">
            {["Markets", "Dashboard"].map((item) => (
              <motion.div
                key={item}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={`/${item.toLowerCase()}`}
                  className="text-xl text-purple-800 hover:text-purple-600 transition-colors duration-200 relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Section: Wallet Connection and Test Mode */}
        <div className="flex items-center gap-4">
          <TestModeToggle />
          <WalletConnectButton />
        </div>
      </nav>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden absolute left-0 right-0 backdrop-blur-lg bg-purple-100/95 shadow-lg border-b border-purple-200"
          >
            <motion.div
              className="container mx-auto px-6 py-4 flex flex-col gap-4"
              variants={{
                open: { transition: { staggerChildren: 0.1 } },
                closed: { transition: { staggerChildren: 0.05 } },
              }}
              initial="closed"
              animate="open"
            >
              {/* Mobile Navigation Links */}
              {["Markets", "Dashboard"].map((item) => (
                <motion.div
                  key={item}
                  variants={{
                    open: { x: 0, opacity: 1 },
                    closed: { x: -20, opacity: 0 },
                  }}
                >
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="block text-xl text-purple-800 hover:text-purple-600 transition-all duration-200 hover:translate-x-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
