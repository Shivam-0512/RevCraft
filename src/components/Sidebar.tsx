import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PackageIcon, ShoppingBagIcon, ClipboardIcon, UserIcon, PlusCircleIcon, LogOutIcon } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Add Product', href: '/addproduct', icon: PlusCircleIcon },
    { name: 'My Products', href: '/myproduct', icon: PackageIcon },
    { name: 'Orders', href: '/orders', icon: ShoppingBagIcon },
    { name: 'Profile', href: '/profile', icon: UserIcon }
  ];

  const handleLogout = () => {
    localStorage.removeItem("seller_id");

    navigate('/seller');
  };

  return (
    <div className="h-full bg-zinc-900 w-64 flex-shrink-0 flex flex-col">
      <div className="flex items-center justify-center h-16 border-b border-zinc-800">
        <Link to="/sellerDashboard" className="text-xl font-bold text-white">
          Seller Dashboard
        </Link>
      </div>
      <nav className="mt-5 px-2 space-y-1 flex-1">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors ${
                location.pathname === item.href
                  ? 'bg-zinc-800 text-white'
                  : 'text-gray-300 hover:bg-zinc-700 hover:text-white'
              }`}
            >
              <Icon className={`${location.pathname === item.href ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-300'} mr-3 h-5 w-5`} aria-hidden="true" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="px-2 mt-auto mb-5 w-64">
        <button
          onClick={handleLogout}
          className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-300 hover:bg-zinc-700 hover:text-white w-full transition-colors"
        >
          <LogOutIcon className="text-gray-400 group-hover:text-gray-300 mr-3 h-5 w-5" aria-hidden="true" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;