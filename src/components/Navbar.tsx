import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuIcon, XIcon, ShoppingCartIcon, UserIcon, MessageCircleIcon, WrenchIcon, LogOutIcon,LogInIcon, ShoppingBag } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    setUser(saved ? JSON.parse(saved) : null);
  }, []);

  useEffect(() => {
    const updateUser = () => {
      const saved = localStorage.getItem("user");
      setUser(saved ? JSON.parse(saved) : null);
    };
    window.addEventListener("userChanged", updateUser);
    updateUser();
    return () => window.removeEventListener("userChanged", updateUser);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("modbot_chat_history");
    setUser(null);
    setIsOpen(false);
  };

  // Detect if on seller portal
  const isSellerPortal = location.pathname.startsWith('/seller');

  const navLinks = isSellerPortal
    ? [
        { name: 'Login', path: '/sellerlogin' , icon: <LogInIcon className="w-5 h-5" /> },
        { name: 'Start Selling', path: '/seller/register', icon: <ShoppingBag className="w-5 h-5" /> }
      ]
    : [
        { name: 'Home', path: '/' },
        { name: 'Buy Parts', path: '/buy-parts' },
        { name: 'ModBot', path: '/modbot', icon: <MessageCircleIcon className="w-5 h-5" /> },
        { name: 'Cart', path: '/cart', icon: <ShoppingCartIcon className="w-5 h-5" /> },
        { name: 'Become a Seller', path: '/seller', icon: <ShoppingBag className="w-5 h-5" />, external: true }
      ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-zinc-900/90 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <WrenchIcon className="h-8 w-8 text-orange-500 rotate-45" />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent">
                RevCraft
              </span>
            </Link>
          </div>
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map(link =>
              link.external ? (
                <a
                  key={link.name}
                  href={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-orange-500'
                      : 'text-gray-300 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  {link.icon && <span className="mr-2">{link.icon}</span>}
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-orange-500'
                      : 'text-gray-300 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  {link.icon && <span className="mr-2">{link.icon}</span>}
                  {link.name}
                </Link>
              )
            )}
            {!isSellerPortal && user ? (
              <>
                <span className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white">
                  <UserIcon className="w-5 h-5 mr-2" />
                  {user.username}
                </span>
                <button
                  onClick={handleSignOut}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white hover:text-orange-500 hover:bg-zinc-800 transition"
                  style={{ background: "none", border: "none" }}
                >
                  <LogOutIcon className="w-5 h-5 mr-2" />
                  Sign Out
                </button>
              </>
            ) : !isSellerPortal && (
              <Link to="/signin" className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-zinc-800 transition">
                Sign In
              </Link>
            )}
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-zinc-800 focus:outline-none">
              {isOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-zinc-800 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map(link =>
              link.external ? (
                <a
                  key={link.name}
                  href={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === link.path
                      ? 'bg-zinc-700 text-orange-500'
                      : 'text-gray-300 hover:bg-zinc-700 hover:text-white'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.icon && <span className="mr-2">{link.icon}</span>}
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === link.path
                      ? 'bg-zinc-700 text-orange-500'
                      : 'text-gray-300 hover:bg-zinc-700 hover:text-white'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.icon && <span className="mr-2">{link.icon}</span>}
                  {link.name}
                </Link>
              )
            )}
            {!isSellerPortal && user ? (
              <>
                <span className="flex items-center px-3 py-2 rounded-md text-base font-medium text-white">
                  <UserIcon className="w-5 h-5 mr-2" />
                  {user.username}
                </span>
                <button
                  onClick={handleSignOut}
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-white hover:text-orange-500 hover:bg-zinc-800 transition"
                  style={{ background: "none", border: "none" }}
                >
                  <LogOutIcon className="w-5 h-5 mr-2" />
                  Sign Out
                </button>
              </>
            ) : !isSellerPortal && (
              <Link to="/signin" className="ml-4 px-3 py-2 rounded-md text-base font-medium text-white hover:bg-zinc-800 transition">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;