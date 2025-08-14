
import { Link } from 'react-router-dom';
import { ArrowRightIcon, TruckIcon, DollarSignIcon, HeadphonesIcon, BarChartIcon, ShieldIcon } from 'lucide-react';
const SellerLanding = () => {
  return <div className="bg-[#121212]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-[#121212] sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block">Sell Online with</span>
                  <span className="block text-orange-500">RevCraft</span>
                </h1>
                <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Reach thousands of car enthusiasts and grow your business.
                  Join our marketplace of premium car modification products.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link to="/register" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 md:py-4 md:text-lg md:px-10">
                      Start Selling
                      <ArrowRightIcon className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link to="/sellerLogin" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-gray-200 bg-gray-800 hover:bg-gray-700 md:py-4 md:text-lg md:px-10">
                      Login
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full bg-[#121212] sm:h-72 md:h-96 lg:w-full lg:h-full relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-[#121212]/80 to-transparent z-10"></div>
            <img className="h-full w-full object-cover" src="https://images.unsplash.com/photo-1600661653561-629509216228?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt="Car workshop with tools and laptop" />
          </div>
        </div>
      </div>
      {/* Additional Content Section */}
      <div className="py-12 bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#222222] p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="bg-orange-500 rounded-full p-2">
                  <BarChartIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="ml-3 text-xl font-medium text-white">
                  Grow Faster
                </h3>
              </div>
              <p className="text-gray-300">
                Accelerate your business growth with our platform that connects
                you directly to thousands of car enthusiasts looking for quality
                modification parts. Expand your reach beyond local markets.
              </p>
            </div>
            <div className="bg-[#222222] p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="bg-orange-500 rounded-full p-2">
                  <DollarSignIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="ml-3 text-xl font-medium text-white">
                  Low Commission
                </h3>
              </div>
              <p className="text-gray-300">
                Our seller-friendly fee structure means you keep more of what
                you earn. Just 8% commission on each sale with no hidden fees.
                Weekly payouts directly to your bank account.
              </p>
            </div>
            <div className="bg-[#222222] p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="bg-orange-500 rounded-full p-2">
                  <HeadphonesIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="ml-3 text-xl font-medium text-white">
                  24/7 Support
                </h3>
              </div>
              <p className="text-gray-300">
                Our dedicated seller support team is available round the clock
                to help you with any issues. Get quick responses to your queries
                and personalized assistance for your business.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Features */}
      <div className="py-12 bg-[#121212]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-orange-500 font-semibold tracking-wide uppercase">
              Benefits
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
              Why Sell on RevCraft?
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-300 lg:mx-auto">
              Join hundreds of sellers already growing their business on our
              platform.
            </p>
          </div>
          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                  <TruckIcon className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-white">
                  Nationwide Reach
                </p>
                <p className="mt-2 ml-16 text-base text-gray-300">
                  Access car enthusiasts across the country looking for quality
                  modification parts.
                </p>
              </div>
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                  <div className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-white">
                  Easy to Use
                </p>
                <p className="mt-2 ml-16 text-base text-gray-300">
                  Our seller tools make listing products, managing inventory,
                  and processing orders simple.
                </p>
              </div>
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                  <DollarSignIcon className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-white">
                  Competitive Fees
                </p>
                <p className="mt-2 ml-16 text-base text-gray-300">
                  Keep more of your profits with our seller-friendly fee
                  structure and fast payouts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Security & Trust */}
      <div className="py-12 bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-10">
            <h2 className="text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
              Trusted by Sellers Across India
            </h2>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <ShieldIcon className="h-8 w-8 text-orange-500 mr-3" />
                <h3 className="text-xl font-medium text-white">
                  Secure Payments
                </h3>
              </div>
              <p className="text-gray-300 mb-6">
                Our secure payment system ensures you receive your money on
                time, every time. Weekly settlements directly to your bank
                account.
              </p>
              <div className="flex items-center mb-4">
                <TruckIcon className="h-8 w-8 text-orange-500 mr-3" />
                <h3 className="text-xl font-medium text-white">
                  Logistics Support
                </h3>
              </div>
              <p className="text-gray-300">
                We handle the shipping logistics so you can focus on your
                products. Our network of shipping partners ensures fast delivery
                across India.
              </p>
            </div>
            <div className="flex-1 bg-[#222222] p-8 rounded-lg">
              <h3 className="text-xl font-medium text-white mb-4">
                Join RevCraft Today
              </h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-orange-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Register in less than 5 minutes
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-orange-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  List your first product the same day
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-orange-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Start receiving orders within 48 hours
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-orange-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Get paid weekly for all your sales
                </li>
              </ul>
              <div className="mt-6">
                <Link to="/register" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-orange-600 hover:bg-orange-700">
                  Start Selling Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default SellerLanding;