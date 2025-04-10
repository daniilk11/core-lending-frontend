import React from "react";

/**
 * Footer component displaying navigation links and community information
 * Contains sections for main navigation, help resources, and community links
 * @returns {React.ReactElement} Footer component
 */
const Footer = () => {
  const basePath =
    process.env.NODE_ENV === "production" ? "/core-lending-frontend" : "";

  return (
    <footer className="bg-purple-100 p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Main Navigation Section */}
        <div>
          <h3 className="font-bold mb-2 text-purple-800">Ultra</h3>
          <ul className="space-y-2">
            <li>
              <a
                href={`${basePath}/dashboard`}
                className="text-purple-700 hover:text-purple-900 transition-colors"
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                href={`${basePath}/markets`}
                className="text-purple-700 hover:text-purple-900 transition-colors"
              >
                Markets
              </a>
            </li>
          </ul>
        </div>
        {/* Help Resources Section */}
        <div>
          <h3 className="font-bold mb-2 text-purple-800">Help</h3>
          <ul className="space-y-2">
            <li>
              <a
                href={`${basePath}/user-docs`}
                className="text-purple-700 hover:text-purple-900 transition-colors"
              >
                User Docs
              </a>
            </li>
            <li>
              <a
                href={`${basePath}/faq`}
                className="text-purple-700 hover:text-purple-900 transition-colors"
              >
                FAQ
              </a>
            </li>
          </ul>
        </div>
        {/* Community Links Section */}
        <div>
          <h3 className="font-bold mb-2 text-purple-800">Community</h3>
          <ul className="space-y-2">
            <li>
              <a
                href="https://github.com/daniilk11/core-lending-frontend/tree/main"
                className="text-purple-700 hover:text-purple-900 transition-colors"
              >
                Github
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
