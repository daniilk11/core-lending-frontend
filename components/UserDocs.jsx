import React from "react";

const docSections = [
  {
    title: "Getting Started",
    content: [
      "Welcome to Core Lending Protocol - a decentralized lending platform built on blockchain technology.",
      "To begin, connect your wallet using the WalletConnect button in the header.",
      "Ensure you have sufficient funds in your wallet for transactions and gas fees.",
    ],
  },
  {
    title: "Lending Assets",
    content: [
      "Navigate to the Markets page to view available lending opportunities.",
      "Select an asset you wish to lend and click 'Supply'.",
      "Enter the amount you want to lend and confirm the transaction.",
      "Your supplied assets will start earning interest immediately.",
    ],
  },
  {
    title: "Borrowing Assets",
    content: [
      "To borrow assets, you must first supply collateral.",
      "The amount you can borrow depends on your collateral ratio.",
      "Select the asset you want to borrow and enter the desired amount.",
      "Review the interest rate and terms before confirming.",
    ],
  },
  {
    title: "Interest Rates",
    content: [
      "Interest rates are determined by supply and demand.",
      "Lenders earn interest on their supplied assets.",
      "Borrowers pay interest on their borrowed assets.",
      "Rates are updated in real-time based on market conditions.",
    ],
  },
  {
    title: "Risk Management",
    content: [
      "Maintain a healthy collateral ratio to avoid liquidation.",
      "Monitor your positions regularly through the dashboard.",
      "Consider market volatility when choosing assets to supply or borrow.",
      "Never supply more than you can afford to lose.",
    ],
  },
];

export function UserDocs() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-purple-800 mb-8">
        User Documentation
      </h1>

      <div className="space-y-8">
        {docSections.map((section, index) => (
          <section key={index} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-purple-700 mb-4">
              {section.title}
            </h2>
            <ul className="space-y-3">
              {section.content.map((item, itemIndex) => (
                <li key={itemIndex} className="text-gray-700 leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-8 p-4 bg-purple-50 rounded-lg">
        <h3 className="text-lg font-semibold text-purple-800 mb-2">
          Need More Help?
        </h3>
        <p className="text-gray-700">
          For additional support, please visit our{" "}
          <a
            href="/faq"
            className="text-purple-700 hover:text-purple-900 transition-colors"
          >
            FAQ page
          </a>{" "}
          or reach out to our community on{" "}
          <a
            href="https://github.com/daniilk11/core-lending-frontend/tree/main"
            className="text-purple-700 hover:text-purple-900 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </div>
  );
}

export default UserDocs;
