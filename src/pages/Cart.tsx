import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCartIcon, TrashIcon, PlusIcon, MinusIcon, ArrowRightIcon, CreditCardIcon, LockIcon } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  // Fetch cart items from backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCartItems([]);
      return;
    }
    fetch("https://backend-vale.onrender.com/api/cart", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setCartItems(data))
      .catch(() => setCartItems([]));
  }, []);

  // Price calculations (in rupees)
  const subtotal = cartItems.reduce((total, item) => total + Number(item.price) * item.quantity, 0);
  const shipping = subtotal > 8000 ? 0 : 199;
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const gst = (subtotal - discount) * 0.18;
  const total = Math.round(subtotal + shipping + gst - discount);

  // Update quantity
  const updateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please sign in to update cart.");
      return;
    }
    try {
      await fetch("https://backend-vale.onrender.com/api/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ product_id: id, quantity: newQuantity - (cartItems.find(item => item.id === id)?.quantity || 1) })
      });
      const res = await fetch("https://backend-vale.onrender.com/api/cart", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(await res.json());
    } catch {
      toast.error("Failed to update cart.");
    }
  };

  // Remove item
  const removeItem = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please sign in to update cart.");
      return;
    }
    try {
      await fetch(`https://backend-vale.onrender.com/api/cart/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const res = await fetch("https://backend-vale.onrender.com/api/cart", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(await res.json());
      toast.success('Item removed from cart');
    } catch {
      toast.error("Failed to remove item.");
    }
  };

  // Promo code logic
  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'revcraft10') {
      setPromoApplied(true);
      toast.success('Promo code applied successfully!');
    } else {
      toast.error('Invalid promo code');
    }
  };

  // Buy Now (Razorpay)
  const handleBuyNow = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please sign in to buy.");
      return;
    }
    try {
      const res = await axios.post(
        "https://backend-vale.onrender.com/api/create-order",
        { amount: total },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const order = res.data;
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "YOUR_RAZORPAY_KEY_ID",
        amount: order.amount,
        currency: "INR",
        name: "RevCraft",
        description: "Cart Payment",
        order_id: order.id,
        handler: function (response: any) {
          toast.success("Payment successful! Payment ID: " + response.razorpay_payment_id);
        },
        prefill: {
          email: "user@email.com",
        },
        theme: { color: "#f97316" }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error("Failed to start payment.");
    }
  };

  if (!localStorage.getItem("token")) {
    return <div className="w-full bg-zinc-900 min-h-screen pt-28 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <ShoppingCartIcon className="h-20 w-20 mx-auto text-gray-500 mb-6" />
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-400 mb-8">
            Please sign in to view your cart.
          </p>
          <Link to="/signin" className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg inline-flex items-center transition-colors">
            Sign In <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>;
  }

  if (cartItems.length === 0) {
    return <div className="w-full bg-zinc-900 min-h-screen pt-28 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <ShoppingCartIcon className="h-20 w-20 mx-auto text-gray-500 mb-6" />
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-400 mb-8">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Link to="/buy-parts" className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg inline-flex items-center transition-colors">
            Start Shopping <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>;
  }

  return <div className="w-full bg-zinc-900 pt-28 pb-20">
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-zinc-800 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-zinc-700">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  Cart Items ({cartItems.length})
                </h2>
                <Link to="/buy-parts" className="text-orange-500 hover:text-orange-400 text-sm">
                  Continue Shopping
                </Link>
              </div>
            </div>
            {/* Cart Items List */}
            <div>
              {cartItems.map(item => <div key={item.id} className="p-6 border-b border-zinc-700 flex flex-col sm:flex-row items-center gap-4">
                <div className="sm:w-24 h-24 bg-zinc-700 rounded-lg overflow-hidden">
                  <img src={item.img || item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <Link to={`/product/${item.product_id || item.id}`} className="text-lg font-medium hover:text-orange-500">
                    {item.name}
                  </Link>
                  <div className="text-gray-400 text-sm mb-2">
                    SKU: PRD-{item.id}00{item.id}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <button onClick={() => updateQuantity(item.product_id || item.id, item.quantity - 1)} className="p-1 rounded bg-zinc-700 hover:bg-zinc-600">
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      <span className="mx-3">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product_id || item.id, item.quantity + 1)} className="p-1 rounded bg-zinc-700 hover:bg-zinc-600">
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 p-1">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">
                    ₹{(Number(item.price) * item.quantity).toLocaleString("en-IN")}
                  </div>
                  <div className="text-sm text-gray-400">
                    ₹{Number(item.price).toLocaleString("en-IN")} each
                  </div>
                </div>
              </div>)}
            </div>
          </div>
          {/* Promo Code */}
          <div className="mt-6 bg-zinc-800 rounded-xl p-6">
            <h3 className="text-lg font-medium mb-4">Have a Promo Code?</h3>
            <div className="flex">
              <input type="text" placeholder="Enter promo code" value={promoCode} onChange={e => setPromoCode(e.target.value)} className="flex-grow bg-zinc-700 border border-zinc-600 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
              <button onClick={applyPromoCode} className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded-r-lg transition-colors">
                Apply
              </button>
            </div>
            {promoApplied && <div className="mt-2 text-green-500 text-sm">
              Promo code applied: 10% discount
            </div>}
            {!promoApplied && <div className="mt-2 text-sm text-gray-400">
              Try "REVCRAFT10" for 10% off your order
            </div>}
          </div>
        </div>
        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-zinc-800 rounded-xl overflow-hidden sticky top-24">
            <div className="p-6 border-b border-zinc-700">
              <h2 className="text-xl font-semibold">Order Summary</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span>
                    {shipping === 0 ? 'Free' : `₹${shipping.toLocaleString("en-IN")}`}
                  </span>
                </div>
                {promoApplied && <div className="flex justify-between text-green-500">
                  <span>Discount (10%)</span>
                  <span>-₹{discount.toLocaleString("en-IN")}</span>
                </div>}
                <div className="flex justify-between">
                  <span className="text-gray-400">GST (18%)</span>
                  <span>₹{gst.toLocaleString("en-IN")}</span>
                </div>
                <div className="border-t border-zinc-700 pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>
              <button onClick={handleBuyNow} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg flex items-center justify-center transition-colors mb-4">
                <CreditCardIcon className="h-5 w-5 mr-2" /> Proceed to
                Checkout
              </button>
              <div className="flex items-center justify-center text-sm text-gray-400">
                <LockIcon className="h-4 w-4 mr-1" /> Secure Checkout
              </div>
              <div className="mt-6 space-y-3">
                <h3 className="font-medium">We Accept</h3>
                <div className="flex space-x-2">
                  <div className="bg-zinc-700 rounded p-2 h-8 w-12"></div>
                  <div className="bg-zinc-700 rounded p-2 h-8 w-12"></div>
                  <div className="bg-zinc-700 rounded p-2 h-8 w-12"></div>
                  <div className="bg-zinc-700 rounded p-2 h-8 w-12"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>;
};

export default Cart;