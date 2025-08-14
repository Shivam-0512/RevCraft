import React, { useState, Fragment } from 'react';
import Sidebar from '../components/Sidebar';
import { ChevronDownIcon, TruckIcon, CheckCircleIcon, ClockIcon, PackageIcon } from 'lucide-react';
const Orders = () => {
  const [orders, setOrders] = useState([{
    id: 'ORD-1234',
    date: '2023-08-10',
    customer: 'Rahul Sharma',
    amount: 2499,
    status: 'Shipped',
    items: [{
      id: 1,
      name: 'Spoiler - Maruti Suzuki Swift 2024',
      price: 2499,
      quantity: 1
    }]
  }, {
    id: 'ORD-1233',
    date: '2023-08-09',
    customer: 'Priya Patel',
    amount: 1999,
    status: 'Delivered',
    items: [{
      id: 2,
      name: 'LED Headlights - Maruti Suzuki Swift 2024',
      price: 1999,
      quantity: 1
    }]
  }, {
    id: 'ORD-1232',
    date: '2023-08-08',
    customer: 'Amit Kumar',
    amount: 4999,
    status: 'Processing',
    items: [{
      id: 3,
      name: 'Alloy Wheels - Maruti Suzuki Swift 2024',
      price: 4999,
      quantity: 1
    }]
  }, {
    id: 'ORD-1231',
    date: '2023-08-07',
    customer: 'Deepak Singh',
    amount: 7999,
    status: 'Delivered',
    items: [{
      id: 1,
      name: 'Body Kit - Maruti Suzuki Swift 2024',
      price: 7999,
      quantity: 1
    }]
  }]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Processing':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'Shipped':
        return <TruckIcon className="h-5 w-5 text-blue-500" />;
      case 'Delivered':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      default:
        return <PackageIcon className="h-5 w-5 text-gray-400" />;
    }
  };
  return <div className="flex h-screen bg-gray-900">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          <h1 className="text-2xl font-semibold text-white mb-6">Orders</h1>
          <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-700">
              <h3 className="text-lg leading-6 font-medium text-white">
                Recent Orders
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-400">
                Manage and track your customer orders
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {orders.map(order => <Fragment key={order.id}>
                      <tr className="hover:bg-gray-750">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {order.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {order.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          ₹{order.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(order.status)}
                            <span className={`ml-1.5 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {order.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          <button onClick={() => toggleOrderDetails(order.id)} className="text-blue-500 hover:text-blue-400 flex items-center">
                            Details
                            <ChevronDownIcon className={`ml-1 h-4 w-4 transform ${expandedOrder === order.id ? 'rotate-180' : ''} transition-transform duration-200`} />
                          </button>
                        </td>
                      </tr>
                      {expandedOrder === order.id && <tr>
                          <td colSpan={6} className="px-6 py-4 bg-gray-750">
                            <div className="border-t border-gray-700 pt-4">
                              <h4 className="text-sm font-medium text-white mb-2">
                                Order Items
                              </h4>
                              <table className="min-w-full divide-y divide-gray-700">
                                <thead className="bg-gray-700">
                                  <tr>
                                    <th scope="col" className="px-6 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                      Product
                                    </th>
                                    <th scope="col" className="px-6 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                      Price
                                    </th>
                                    <th scope="col" className="px-6 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                      Quantity
                                    </th>
                                    <th scope="col" className="px-6 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                      Total
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-gray-750 divide-y divide-gray-700">
                                  {order.items.map(item => <tr key={item.id}>
                                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-300">
                                        {item.name}
                                      </td>
                                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-300">
                                        ₹{item.price.toLocaleString()}
                                      </td>
                                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-300">
                                        {item.quantity}
                                      </td>
                                      <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-300">
                                        ₹
                                        {(item.price * item.quantity).toLocaleString()}
                                      </td>
                                    </tr>)}
                                </tbody>
                              </table>
                              <div className="mt-4 flex justify-between items-center">
                                <div>
                                  <h4 className="text-sm font-medium text-white mb-1">
                                    Shipping Address
                                  </h4>
                                  <p className="text-xs text-gray-400">
                                    123 Main St, Apartment 4B
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    Mumbai, Maharashtra 400001
                                  </p>
                                </div>
                                <div>
                                  <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-600 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md bg-gray-700 text-white" defaultValue={order.status}>
                                    <option value="Processing">
                                      Processing
                                    </option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                  </select>
                                  <button className="mt-2 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                                    Update Status
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>}
                    </Fragment>)}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>;
};
export default Orders;