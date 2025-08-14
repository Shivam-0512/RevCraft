import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircleIcon, PackageIcon, ShoppingBagIcon, UserIcon } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  const navigate = useNavigate();
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
  const seller_id = localStorage.getItem("seller_id");
  if (!seller_id) return;
  fetch(`https://backend-vale.onrender.com/api/products?seller_id=${seller_id}`)
    .then(res => res.json())
    .then(data => setTotalProducts(data.length))
    .catch(() => setTotalProducts(0));
}, []);

  // All other stats set to 0 or empty
  const stats = [
    { name: 'Total Products', value: totalProducts, icon: PackageIcon },
    { name: 'Active Orders', value: 0, icon: ShoppingBagIcon },
    { name: 'Total Sales', value: '₹0', icon: PlusCircleIcon },
    { name: 'Customers', value: 0, icon: UserIcon }
  ];

  const recentOrders: any[] = []; 

  return (
    <div className="flex h-screen bg-zinc-900">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          <h1 className="text-2xl font-semibold text-white mb-6">
            Dashboard Overview
          </h1>
          {/* Stats */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map(stat => {
              const Icon = stat.icon;
              return (
                <div key={stat.name} className="bg-zinc-800 overflow-hidden shadow rounded-lg border border-zinc-700">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Icon className="h-6 w-6 text-orange-500" aria-hidden="true" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-400 truncate">
                            {stat.name}
                          </dt>
                          <dd>
                            <div className="text-lg font-medium text-white">
                              {stat.value}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Recent Orders */}
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">
            Recent Orders
          </h2>
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-zinc-700 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-zinc-700">
                    <thead className="bg-zinc-800">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Product
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Customer
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-zinc-800 divide-y divide-zinc-700">
                      {recentOrders.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center text-gray-400 py-8">
                            No recent orders.
                          </td>
                        </tr>
                      ) : (
                        recentOrders.map(order => (
                          <tr key={order.id} className="hover:bg-zinc-700">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                              {order.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {order.product}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {order.customer}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {order.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-zinc-700 text-gray-400`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          {/* Quick Actions */}
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <button onClick={() => navigate('/add-product')} className="bg-zinc-800 hover:bg-zinc-700 overflow-hidden shadow rounded-lg p-6 border border-zinc-700">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-orange-500 rounded-md p-3">
                  <PlusCircleIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <div className="text-lg font-medium text-white text-left">
                    Add New Product
                  </div>
                  <p className="mt-1 text-sm text-gray-400 text-left">
                    List a new product for sale on RevCraft
                  </p>
                </div>
              </div>
            </button>
            <button onClick={() => navigate('/my-products')} className="bg-zinc-800 hover:bg-zinc-700 overflow-hidden shadow rounded-lg p-6 border border-zinc-700">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <PackageIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <div className="text-lg font-medium text-white text-left">
                    Manage Products
                  </div>
                  <p className="mt-1 text-sm text-gray-400 text-left">
                    View and edit your product listings
                  </p>
                </div>
              </div>
            </button>
            <button onClick={() => navigate('/orders')} className="bg-zinc-800 hover:bg-zinc-700 overflow-hidden shadow rounded-lg p-6 border border-zinc-700">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <ShoppingBagIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <div className="text-lg font-medium text-white text-left">
                    View Orders
                  </div>
                  <p className="mt-1 text-sm text-gray-400 text-left">
                    Check and manage your pending orders
                  </p>
                </div>
              </div>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;