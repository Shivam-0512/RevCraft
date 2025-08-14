import React from 'react';
import { Link } from 'react-router-dom';
import { WrenchIcon, FacebookIcon, TwitterIcon, InstagramIcon, YoutubeIcon } from 'lucide-react';
const Footer = () => {
  return <footer className="bg-zinc-950 text-gray-300">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center">
              <WrenchIcon className="h-8 w-8 text-orange-500 rotate-45" />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent">
                RevCraft
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-400">
              Your ultimate destination for premium car modifications and
              performance parts.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-orange-500">
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500">
                <TwitterIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500">
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500">
                <YoutubeIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              {['Home', 'Buy Parts', 'ModBot', 'About Us', 'Blog'].map(item => <li key={item}>
                    <Link to="#" className="text-sm text-gray-400 hover:text-orange-500">
                      {item}
                    </Link>
                  </li>)}
            </ul>
          </div>
          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
              Support
            </h3>
            <ul className="mt-4 space-y-2">
              {['FAQ', 'Shipping', 'Returns', 'Warranty', 'Privacy Policy'].map(item => <li key={item}>
                    <Link to="#" className="text-sm text-gray-400 hover:text-orange-500">
                      {item}
                    </Link>
                  </li>)}
            </ul>
          </div>
          {/* Contact Us */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
              Contact Us
            </h3>
            <ul className="mt-4 space-y-2">
              <li className="text-sm text-gray-400">
                123 Garage Street, Motorville
              </li>
              <li className="text-sm text-gray-400">contact@revcraft.com</li>
              <li className="text-sm text-gray-400">+1 (555) 123-4567</li>
              <li className="mt-4">
                <Link to="#" className="text-sm text-orange-500 hover:text-orange-400">
                  Get In Touch →
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} RevCraft. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6">
              <li>
                <Link to="#" className="text-xs text-gray-400 hover:text-orange-500">
                  Terms
                </Link>
              </li>
              <li>
                <Link to="#" className="text-xs text-gray-400 hover:text-orange-500">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-xs text-gray-400 hover:text-orange-500">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;