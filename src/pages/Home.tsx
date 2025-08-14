import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import { ArrowRightIcon, WrenchIcon, GaugeIcon, SparklesIcon, ZapIcon } from 'lucide-react';
import ProductCard from '../components/ProductCard';



const partners = [{
  name: 'Brembo',
  logo: './assets/partner1.png'
}, {
  name: 'Sparco',
  logo: './assets/partner6.png'
}, {
  name: 'KW Suspension',
  logo: './assets/partner3.png'
}, {
  name: 'Recaro',
  logo: './assets/partner4.png'
}, {
  name: 'BBS',
  logo: './assets/partner5.png'
}];


const Home = () => {

  type Product = {
    id: string | number;
    name: string;
    price: number | string;
    img: string;
    category?: string;
    rating?: number;
    description?: string;
    // add any other fields you use
  };

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    axios.get("https://backend-vale.onrender.com/api/products")
      .then(res => {
        // You can pick the first 4, or filter for "featured" if you have a flag
        setFeaturedProducts(res.data.slice(0, 4));
      })
      .catch(err => console.error(err));
  }, []);

  return <div className="w-full bg-zinc-900">
    {/* Hero Section */}
    <section className="relative h-screen flex items-center overflow-hidden ">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 to-zinc-900/40 " />
        <video className="w-full h-full object-cover" autoPlay muted loop poster="https://images.unsplash.com/photo-1562141960-c9a726a53359?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80">
          <source src="./assets/car_back.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
       <div className="container mx-auto px-6 relative z-20 flex flex-col md:flex-row items-center justify-between h-full">
    {/* Left: Text */}
    <div className="max-w-3xl md:w-1/2">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
          Transform Your Ride with
        </span>
        <span className="block bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-blue-500">
          Premium Modifications
        </span>
      </h1>
      <p className="text-gray-300 text-lg md:text-xl mb-8">
        Unleash your vehicle's true potential with our expert-curated
        performance parts and accessories.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/buy-parts" className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg flex items-center justify-center transition-colors">
          Explore Parts <ArrowRightIcon className="ml-2 h-5 w-5" />
        </Link>
        <Link to="/modbot" className="px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg flex items-center justify-center border border-zinc-700 transition-colors">
          Talk to ModBot
        </Link>
      </div>
    </div>
 
  </div>
      {/* Animated gears */}
      <div className="absolute bottom-10 right-10 opacity-30 animate-spin-slow">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 8C14 9.10457 13.1046 10 12 10C10.8954 10 10 9.10457 10 8C10 6.89543 10.8954 6 12 6C13.1046 6 14 6.89543 14 8Z" stroke="#f97316" strokeWidth="2" />
          <path d="M19.4264 12.4264C19.4264 12.4264 19.4264 14.0711 18.4264 15.0711C17.4264 16.0711 15.7818 16.0711 15.7818 16.0711" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#f97316" strokeWidth="2" />
        </svg>
      </div>
      <div className="absolute top-20 left-10 opacity-20 animate-spin-slow-reverse">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 8C14 9.10457 13.1046 10 12 10C10.8954 10 10 9.10457 10 8C10 6.89543 10.8954 6 12 6C13.1046 6 14 6.89543 14 8Z" stroke="#f97316" strokeWidth="2" />
          <path d="M19.4264 12.4264C19.4264 12.4264 19.4264 14.0711 18.4264 15.0711C17.4264 16.0711 15.7818 16.0711 15.7818 16.0711" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#f97316" strokeWidth="2" />
        </svg>
      </div>
    </section>
    {/* Services Section */}
    <section className="py-20 bg-zinc-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our Premium Services
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            From performance upgrades to aesthetic enhancements, we offer a
            comprehensive range of services to transform your vehicle.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[{
            icon: <WrenchIcon className="h-10 w-10 text-orange-500" />,
            title: 'Performance Tuning',
            description: "Optimize your vehicle's engine for maximum power and efficiency."
          }, {
            icon: <GaugeIcon className="h-10 w-10 text-orange-500" />,
            title: 'Custom Exhaust',
            description: 'Engineered exhaust systems that enhance sound and performance.'
          }, {
            icon: <SparklesIcon className="h-10 w-10 text-orange-500" />,
            title: 'Body Kits',
            description: "Transform your vehicle's appearance with premium body modifications."
          }, {
            icon: <ZapIcon className="h-10 w-10 text-orange-500" />,
            title: 'Lighting Upgrades',
            description: 'Advanced LED and HID lighting solutions for better visibility and style.'
          }].map((service, index) => <div key={index} className="bg-zinc-800 p-6 rounded-xl hover:bg-zinc-700 transition-colors border border-zinc-700 hover:border-orange-500/30">
            <div className="bg-zinc-900 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              {service.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
            <p className="text-gray-400">{service.description}</p>
            <Link to="/buy-parts" className="inline-block mt-4 text-orange-500 hover:text-orange-400">
              Learn more →
            </Link>
          </div>)}
        </div>
      </div>
    </section>
    {/* Featured Products */}
    <section className="py-20 bg-zinc-800/50">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-12 ">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <Link to="/buy-parts" className="text-orange-500 hover:text-orange-400 flex items-center">
            View all products <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
            {featuredProducts.map(product => (
              <ProductCard
                key={product.id}
                id={String(product.id)}
                name={product.name}
                price={Number(product.price)}
                image={product.img}
                category={product.category || ""}
                rating={product.rating ?? 0}
              />
            ))}
       
        </div>
      </div>
    </section>
    {/* ModBot Promo */}
    <section className="py-20 bg-zinc-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500 to-orange-500" style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)'
        }}></div>
      </div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Meet <span className="text-orange-500">ModBot</span>, Your AI
              Modification Assistant
            </h2>
            <p className="text-gray-300 mb-6">
              Get personalized recommendations, technical advice, and
              installation guidance from our advanced AI assistant.
            </p>
            <ul className="space-y-3 mb-8">
              {['24/7 technical support', 'Compatible part recommendations', 'Installation guides', 'Performance optimization advice'].map((feature, index) => <li key={index} className="flex items-center">
                <span className="h-6 w-6 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center mr-3">
                  ✓
                </span>
                <span>{feature}</span>
              </li>)}
            </ul>
            <Link to="/modbot" className="inline-block px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-lg transition-all">
              Chat with ModBot
            </Link>
          </div>
          <div className="lg:w-1/2 lg:pl-16">
            <div className="bg-zinc-800 rounded-xl p-6 shadow-2xl border border-zinc-700 relative">
              <div className="bg-zinc-900 rounded-t-lg p-4 flex items-center">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="mx-auto text-sm font-medium">ModBot Chat</div>
              </div>
              <div className="p-4 h-80 overflow-y-auto">
                <div className="flex flex-col space-y-4">
                  <div className="bg-zinc-700 rounded-lg p-3 max-w-[80%] self-start">
                    <p className="text-sm">
                      I want to improve my 2018 Honda Civic's performance.
                      What mods do you recommend?
                    </p>
                  </div>
                  <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-3 max-w-[80%] self-end">
                    <p className="text-sm">
                      Based on your 2018 Honda Civic, I'd recommend starting
                      with these performance upgrades:
                    </p>
                    <ul className="list-disc pl-5 mt-2 text-sm">
                      <li>Cold air intake system (+5-10 HP)</li>
                      <li>Cat-back exhaust system</li>
                      <li>ECU tuning</li>
                    </ul>
                    <p className="text-sm mt-2">
                      Would you like specific product recommendations?
                    </p>
                  </div>
                  <div className="bg-zinc-700 rounded-lg p-3 max-w-[80%] self-start">
                    <p className="text-sm">
                      Yes, please recommend a good exhaust system.
                    </p>
                  </div>
                  <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-3 max-w-[80%] self-end">
                    <p className="text-sm">
                      Here's a top-rated exhaust system for your Civic:
                    </p>
                    <div className="mt-3">
                      <ProductCard id="3" name="HyperFlow Exhaust System" price={449.99} image="https://images.unsplash.com/photo-1621677390424-1d216f75430e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" category="Exhaust" rating={4.9} inChat={true} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-zinc-700 flex items-center">
                <input type="text" placeholder="Ask ModBot about car modifications..." className="flex-grow bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
                <button className="ml-2 bg-orange-500 hover:bg-orange-600 rounded-lg p-2 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    {/* Partners Section */}
    <section className="py-16 bg-zinc-800/30">
      <div className="container mx-auto px-6">
        <h2 className="text-xl font-semibold text-center mb-10 text-gray-300">
          Trusted by Leading Brands
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16">
          {partners.map(partner => <div key={partner.name} className="h-12 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300">
            <img src={partner.logo} alt={partner.name} className="h-full object-contain" />
          </div>)}
        </div>
      </div>
    </section>
    {/* CTA Section */}
    <section className="py-20 bg-gradient-to-r from-zinc-900 to-zinc-800">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Transform Your Ride?
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto mb-8">
          Browse our extensive collection of premium performance parts and
          accessories to take your vehicle to the next level.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/buy-parts" className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors">
            Shop Now
          </Link>
          <Link to="/modbot" className="px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg border border-zinc-700 transition-colors">
            Get Expert Advice
          </Link>
        </div>
      </div>
    </section>
  </div>;
};
export default Home;