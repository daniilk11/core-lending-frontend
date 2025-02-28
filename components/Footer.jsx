import React from 'react';

const Footer = () => {
  return (
        <footer className="bg-purple-100 p-8">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-2 text-purple-800">Ultra</h3>
              <ul className="space-y-2">
                <li><a href="/dashboard" className="text-purple-700 hover:text-purple-900 transition-colors">Dashboard</a></li>
                <li><a href="/markets" className="text-purple-700 hover:text-purple-900 transition-colors">Markets</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-2 text-purple-800">Help</h3>
              <ul className="space-y-2">
                <li><a href="/user-docs" className="text-purple-700 hover:text-purple-900 transition-colors">User Docs</a></li>
                <li><a href="/faq" className="text-purple-700 hover:text-purple-900 transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-2 text-purple-800">Community</h3>
              <ul className="space-y-2">
                {/*// TODO Add social links*/}
                <li><a href="https://github.com/your-repo" className="text-purple-700 hover:text-purple-900 transition-colors">Github</a></li>
              </ul>
            </div>
          </div>
        </footer>
  );
};

export default Footer;