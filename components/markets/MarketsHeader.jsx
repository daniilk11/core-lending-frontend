import React from "react";

/**
 * Header component for the Markets page
 * Displays the title and description of the markets section
 * @returns {React.ReactElement} Markets header component
 */
const MarketsHeader = () => (
  <div>
    {/* Main title */}
    <h1 className="text-4xl font-bold text-purple-700 mb-6">Markets</h1>
    {/* Description text explaining the purpose of the markets section */}
    <p className="mb-8 text-lg text-purple-700">
      Supply to receive interest or borrow to get liquidity. Maximize your
      earnings as a Liquidity Provider.
    </p>
  </div>
);

export default MarketsHeader;
