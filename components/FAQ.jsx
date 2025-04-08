import React from "react";

const faqItems = [
  {
    question: "What is Core Lending Protocol?",
    answer:
      "Core Lending Protocol is a decentralized lending platform that enables users to lend and borrow digital assets. It provides a secure and efficient way to earn interest on your crypto assets or borrow against your collateral.",
  },
  {
    question: "How do I start lending my assets?",
    answer:
      "To start lending, connect your wallet, navigate to the Markets page, select an asset you want to lend, and click the 'Supply' button. Enter the amount you wish to lend and confirm the transaction.",
  },
  {
    question: "What determines the interest rates?",
    answer:
      "Interest rates are determined by supply and demand dynamics in each market. When more users supply an asset, rates tend to decrease, and when more users borrow, rates tend to increase.",
  },
  {
    question: "How does borrowing work?",
    answer:
      "To borrow assets, you must first supply collateral. The amount you can borrow depends on your collateral ratio. Select the asset you want to borrow, enter the amount, and confirm the transaction.",
  },
  {
    question: "What is a collateral ratio?",
    answer:
      "The collateral ratio is the ratio of your supplied collateral to your borrowed assets. Maintaining a healthy collateral ratio is crucial to avoid liquidation of your position.",
  },
  {
    question: "What happens if my collateral ratio falls too low?",
    answer:
      "If your collateral ratio falls below the minimum required ratio, your position may be liquidated to protect the protocol. It's important to monitor your positions and maintain a healthy collateral ratio.",
  },
  {
    question: "Are there any fees for using the protocol?",
    answer:
      "Yes, there are small protocol fees for lending and borrowing activities. These fees help maintain and develop the protocol. The exact fee structure can be found in the Markets page for each asset.",
  },
  {
    question: "How do I withdraw my supplied assets?",
    answer:
      "You can withdraw your supplied assets at any time through the Markets page, as long as you have sufficient liquidity in the market. Select the asset, click 'Withdraw', and confirm the transaction.",
  },
];

export function FAQ() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-purple-800 mb-8">
        Frequently Asked Questions
      </h1>

      <div className="space-y-6">
        {faqItems.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-purple-700 mb-3">
              {item.question}
            </h2>
            <p className="text-gray-700 leading-relaxed">{item.answer}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-purple-50 rounded-lg">
        <h3 className="text-lg font-semibold text-purple-800 mb-2">
          Still Have Questions?
        </h3>
        <p className="text-gray-700">
          Check out our{" "}
          <a
            href="/user-docs"
            className="text-purple-700 hover:text-purple-900 transition-colors"
          >
            User Documentation
          </a>{" "}
          for more detailed information or reach out to our community on{" "}
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

export default FAQ;
