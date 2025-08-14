import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCartIcon, EyeIcon } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
  rating: number;
  inChat?: boolean;
}
const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  image,
  price,
  category,
  rating,
  inChat = false
}) => {
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
  const renderStars = () => {
    return Array(5).fill(0).map((_, i) => <span key={i} className={`text-sm ${i < rating ? 'text-orange-500' : 'text-gray-500'}`}>
      ★
    </span>);
  };
  if (inChat) {
    return <Link to={`/product/${id}`} className="block w-full">
      <div className="flex items-center bg-zinc-800 rounded-lg overflow-hidden hover:bg-zinc-700 transition-colors">
        <img src={image} alt={name} className="w-20 h-20 object-cover" />
        <div className="p-3">
          <h3 className="text-sm font-medium text-white">{name}</h3>
          <p className="text-orange-500 font-bold">${price.toFixed(2)}</p>
          <button onClick={handleAddToCart} className="mt-1 text-xs flex items-center text-blue-400 hover:text-blue-300">
            <ShoppingCartIcon className="h-3 w-3 mr-1" /> Add to cart
          </button>
        </div>
      </div>
    </Link>;
  }
  return <Link to={`/product/${id}`} className="group">
    <div className="bg-zinc-800 rounded-xl overflow-hidden shadow-lg hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
          <span className="text-xs text-white px-2 py-1 bg-orange-500 rounded-full">
            {category}
          </span>
          <button onClick={handleAddToCart} className="p-2 bg-white rounded-full text-zinc-900 hover:bg-orange-500 hover:text-white transition-colors">
            <ShoppingCartIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-white group-hover:text-orange-500 transition-colors">
            {name}
          </h3>
          <span className="text-xl font-bold text-orange-500">
            ₹{price.toFixed(2)}
          </span>
        </div>
        <div className="mt-2 flex items-center">
          <div className="flex">{renderStars()}</div>
          <span className="text-xs text-gray-400 ml-2">
            ({(rating * 17).toFixed(0)} reviews)
          </span>
        </div>
        <div className="mt-4">
          <button className="w-full py-2 flex items-center justify-center bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm font-medium transition-colors">
            <EyeIcon className="h-4 w-4 mr-2" /> View Product
          </button>
        </div>
      </div>
    </div>
  </Link>;
};
export default ProductCard;