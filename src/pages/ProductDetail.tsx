import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRightIcon, StarIcon, TruckIcon, ShieldIcon, ArrowLeftIcon, ShoppingCartIcon, HeartIcon, ShareIcon, MinusIcon, PlusIcon } from 'lucide-react';
import { toast } from 'sonner';
import ProductCard from '../components/ProductCard';
import axios from 'axios';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');



  useEffect(() => {
    if (!id) return;
    // Fetch product details from backend
    fetch(`https://backend-vale.onrender.com/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(() => setProduct(null));
  }, [id]);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please sign in to add to cart.");
      return;
    }

    try {
      await axios.post("https://backend-vale.onrender.com/api/cart", {
        product_id: Number(id),
        quantity: 1
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`${name} added to cart!`);
    } catch (err) {
      toast.error("Failed to add to cart.");
    }
  };
  const handleBuyNow = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please sign in to buy.");
      return;
    }
    try {
      // Use product price (in rupees)
      const res = await axios.post(
        "https://backend-vale.onrender.com/api/create-order",
        { amount: Number(product.price) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const order = res.data;
      // Open Razorpay checkout
     
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "YOUR_RAZORPAY_KEY_ID",
        amount: order.amount,
        currency: "INR",
        name: "RevCraft",
        description: product.name,
        order_id: order.id,
        handler: function (response: any) {
          toast.success("Payment successful! Payment ID: " + response.razorpay_payment_id);
        },
        prefill: {
          email: "user@email.com", // Optionally use logged-in user's email
        },
        theme: { color: "#f97316" }
      };
      console.log("Razorpay options:", options);
      
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error("Failed to start payment.");
    }
  };

  if (!product) {
    return <div className="w-full bg-zinc-900 pt-16 text-center text-white">Loading product...</div>;
  }

  // Use only the first image, or a placeholder if missing
  const images = product.img ? [product.img] : [
    "https://images.unsplash.com/photo-1621677390424-1d216f75430e?auto=format&fit=crop&w=1470&q=80"
  ];

  // Parse about and car_models fields if they are JSON strings
  let about: string[] = [];
  try {
    about = typeof product.about === "string" ? JSON.parse(product.about) : product.about || [];
  } catch {
    about = [];
  }
  let carModels: string[] = [];
  try {
    carModels = typeof product.car_models === "string" ? JSON.parse(product.car_models) : product.car_models || [];
  } catch {
    carModels = [];
  }

  return <div className="w-full bg-zinc-900 pt-16">
    {/* Breadcrumbs */}
    <div className="bg-zinc-800 py-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center text-sm text-gray-400">
          <Link to="/" className="hover:text-orange-500">Home</Link>
          <ChevronRightIcon className="h-4 w-4 mx-2" />
          <Link to="/buy-parts" className="hover:text-orange-500">Parts</Link>
          <ChevronRightIcon className="h-4 w-4 mx-2" />
          <span className="text-orange-500">{product.name}</span>
        </div>
      </div>
    </div>
    {/* Product Detail */}
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Images */}
        <div className="lg:w-1/2">
          <div className="bg-zinc-800 rounded-lg overflow-hidden mb-4">
            <img src={images[selectedImage]} alt={product.name} className="w-full h-96 object-contain" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {images.map((image, index) => (
              <button key={index} onClick={() => setSelectedImage(index)} className={`bg-zinc-800 rounded-lg overflow-hidden border-2 ${selectedImage === index ? 'border-orange-500' : 'border-transparent'}`}>
                <img src={image} alt={`${product.name} view ${index + 1}`} className="w-full h-20 object-contain" />
              </button>
            ))}
          </div>
        </div>
        {/* Product Info */}
        <div className="lg:w-1/2">
          <div className="mb-2">
            <span className="inline-block bg-orange-500/20 text-orange-500 text-xs font-semibold px-2.5 py-1 rounded-full">
              {product.category || "Part"}
            </span>
            <span className="inline-block ml-2 bg-green-500/20 text-green-500 text-xs font-semibold px-2.5 py-1 rounded-full">
              In Stock
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className={`h-5 w-5 ${i < Math.floor(product.rating ?? 0) ? 'text-orange-500' : 'text-gray-400'}`} fill={i < Math.floor(product.rating ?? 0) ? 'currentColor' : 'none'} />
              ))}
            </div>
            <span className="text-sm text-gray-400 ml-2">
              ({product.reviewCount ?? 0} reviews)
            </span>
          </div>
          <div className="text-3xl font-bold text-orange-500 mb-4">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </div>
          <p className="text-gray-300 mb-6">{product.description}</p>
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <span className="text-gray-400 w-24">Brand:</span>
              <span>{product.brand || "—"}</span>
            </div>
            <div className="flex items-center mb-4">
              <span className="text-gray-400 w-24">SKU:</span>
              <span>{product.sku || "—"}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-400 w-24">Availability:</span>
              <span className="text-green-500">{product.stock ?? 10} in stock</span>
            </div>
          </div>
          <div className="mb-6">
            <div className="flex items-center">
              <div className="mr-4">
                <label className="block text-sm text-gray-400 mb-1">
                  Quantity
                </label>
                <div className="flex items-center">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded-l-lg">
                    <MinusIcon className="h-4 w-4" />
                  </button>
                  <input type="number" min="1" value={quantity} onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} className="bg-zinc-800 text-center w-12 p-2 border-x border-zinc-700 focus:outline-none" />
                  <button onClick={() => setQuantity(quantity + 1)} className="bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded-r-lg">
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button onClick={handleAddToCart} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center transition-colors">
              <ShoppingCartIcon className="h-5 w-5 mr-2" /> Add to Cart
            </button>
            <button onClick={handleBuyNow} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center transition-colors">
              Buy Now
            </button>
          </div>
          <div className="flex items-center space-x-4 mb-6">
            <button className="flex items-center text-gray-400 hover:text-orange-500">
              <HeartIcon className="h-5 w-5 mr-1" /> Wishlist
            </button>
            <button className="flex items-center text-gray-400 hover:text-orange-500">
              <ShareIcon className="h-5 w-5 mr-1" /> Share
            </button>
          </div>
          <div className="space-y-3 border-t border-zinc-800 pt-6">
            <div className="flex items-center">
              <TruckIcon className="h-5 w-5 text-orange-500 mr-3" />
              <span>Free shipping on orders over ₹8,000</span>
            </div>
            <div className="flex items-center">
              <ShieldIcon className="h-5 w-5 text-orange-500 mr-3" />
              <span>2 year warranty on all products</span>
            </div>
          </div>
        </div>
      </div>
      {/* Product Tabs */}
      <div className="mt-12">
        <div className="border-b border-zinc-800">
          <nav className="flex space-x-8">
            {['description', 'specifications', 'compatibility', 'reviews'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`py-4 px-1 text-sm font-medium border-b-2 ${activeTab === tab ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-400 hover:text-white hover:border-gray-700'}`}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
        <div className="py-8">
          {activeTab === 'description' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Product Features</h3>
              <ul className="space-y-2 mb-6">
                {about.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="h-6 w-6 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center mr-3 mt-0.5">
                      ✓
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <p className="mb-4">{product.description}</p>
            </div>
          )}
          {activeTab === 'specifications' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Technical Specifications</h3>
              <div className="bg-zinc-800 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-zinc-700">
                  <tbody className="divide-y divide-zinc-700">
                    {/* Leave empty for now */}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeTab === 'compatibility' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Compatible Vehicles</h3>
              <div className="bg-zinc-800 rounded-lg p-6">
                <ul className="space-y-2">
                  {carModels.map((model, index) => (
                    <li key={index} className="flex items-start">
                      <span className="h-6 w-6 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center mr-3 mt-0.5">
                        ✓
                      </span>
                      <span>{model}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm text-gray-400">
                  Not sure if this product fits your vehicle? Contact our support team or use our vehicle compatibility checker.
                </p>
              </div>
            </div>
          )}
          {activeTab === 'reviews' && (
            <div>
              {/* Leave reviews empty for now */}
              <div className="text-gray-400">No reviews yet.</div>
            </div>
          )}
        </div>
      </div>
      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         
        </div>
      </div>
      {/* Back to Products */}
      <div className="mt-12 text-center">
        <Link to="/buy-parts" className="inline-flex items-center px-6 py-3 border border-zinc-700 rounded-lg hover:border-orange-500 hover:text-orange-500 transition-colors">
          <ArrowLeftIcon className="h-4 w-4 mr-2" /> Back to All Products
        </Link>
      </div>
    </div>
  </div>;
};

export default ProductDetail;