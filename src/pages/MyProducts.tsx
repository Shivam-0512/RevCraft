import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { PlusCircleIcon, EditIcon, TrashIcon, EyeIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  about: string[];
  car_models: string[]; 
  img: string;
  in_stock: boolean;
}

const MyProducts = () => {
  const seller_id = localStorage.getItem("seller_id");
  const [products, setProducts] = useState<Product[]>([]);
  const [editProduct, setEditProduct] = useState<any | null>(null);
  
  // State for the custom delete confirmation modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Product | null>(null);

  // Fetch products for this seller
  useEffect(() => {
    if (!seller_id) return;
    axios.get(`https://backend-vale.onrender.com/api/products?seller_id=${seller_id}`)
      .then(res => setProducts(res.data))
      .catch(() => setProducts([]));
  }, [seller_id]);

  // Delete product (and image)
  const handleDelete = async (productToDelete: Product) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`https://backend-vale.onrender.com/api/seller/delete-product/${productToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { imgUrl: productToDelete.img } 
      });
      setProducts(products.filter(product => product.id !== productToDelete.id));
      toast.success('Product deleted!');
    } catch {
      toast.error('Failed to delete product.');
    } finally {
      setShowDeleteConfirm(null); 
    }
  };

  // Toggle in_stock status
  const handleToggleStatus = async (id: number, inStock: boolean) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`https://backend-vale.onrender.com/api/seller/update-stock/${id}`, {
        in_stock: !inStock
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(products.map(product =>
        product.id === id ? { ...product, in_stock: !inStock } : product
      ));
      toast.success('Stock status updated!');
    } catch {
      toast.error('Failed to update stock status.');
    }
  };


  const handleEdit = (product: Product) => {

    setEditProduct({
      ...product,
      about: Array.isArray(product.about) ? product.about.join(', ') : '',
      compatibleCars: Array.isArray(product.car_models) ? product.car_models.join(', ') : ''
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditProduct((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      // The data sent to the backend needs to be in the correct format
      const updatedProductData = {
        ...editProduct,
   
        about: JSON.stringify(editProduct.about.split(',').map((s: string) => s.trim())),
        car_models: JSON.stringify(editProduct.compatibleCars.split(',').map((s: string) => s.trim()))
      };

      await axios.put(`https://backend-vale.onrender.com/api/seller/update-product/${editProduct.id}`, updatedProductData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update the local state with the original array format
      setProducts(products.map(p =>
        p.id === editProduct.id ? { 
            ...p, 
            ...editProduct, 
            about: editProduct.about.split(',').map((s: string) => s.trim()),
            car_models: editProduct.compatibleCars.split(',').map((s: string) => s.trim())
        } : p
      ));
      
      setEditProduct(null);
      toast.success('Product updated!');
    } catch {
      toast.error('Failed to update product.');
    }
  };

  return (
    <div className="flex h-screen bg-zinc-900">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-white">My Products ({products.length})</h1>
            <Link to="/add-product" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700">
              <PlusCircleIcon className="h-5 w-5 mr-2" />
              Add New Product
            </Link>
          </div>
          <div className="bg-zinc-800 shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-700">
              {products.map(product => (
                <li key={product.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-16 w-16">
                      <img className="h-16 w-16 rounded-md object-cover" src={product.img} alt={product.name} />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-white">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-400">
                        ₹{Number(product.price).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full mr-4 ${product.in_stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {product.in_stock ? 'In Stock' : 'Out of Stock'}
                    </span>
                    <button onClick={() => handleToggleStatus(product.id, product.in_stock)} className="mr-2 text-gray-400 hover:text-gray-200" title="Toggle Stock">
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleEdit(product)} className="mr-2 text-gray-400 hover:text-blue-500" title="Edit Product">
                      <EditIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => setShowDeleteConfirm(product)} className="text-gray-400 hover:text-red-500" title="Delete Product">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {/* Edit Product Modal */}
          {editProduct && (
            <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
              <form onSubmit={handleEditSubmit} className="bg-zinc-800 p-6 rounded-lg shadow-lg w-full max-w-lg space-y-4">
                <h2 className="text-xl font-semibold text-white mb-4">Edit Product</h2>
                <input name="name" value={editProduct.name} onChange={handleEditChange} className="w-full bg-zinc-700 text-white rounded px-3 py-2" />
                <input name="price" type="number" value={editProduct.price} onChange={handleEditChange} className="w-full bg-zinc-700 text-white rounded px-3 py-2" />
                <input name="category" value={editProduct.category} onChange={handleEditChange} className="w-full bg-zinc-700 text-white rounded px-3 py-2" />
                <input name="compatibleCars" value={editProduct.compatibleCars} onChange={handleEditChange} className="w-full bg-zinc-700 text-white rounded px-3 py-2" placeholder="Compatible Cars (comma-separated)" />
                <textarea name="about" value={editProduct.about} onChange={handleEditChange} className="w-full bg-zinc-700 text-white rounded px-3 py-2" placeholder="About (comma-separated)" />
                <textarea name="description" value={editProduct.description} onChange={handleEditChange} className="w-full bg-zinc-700 text-white rounded px-3 py-2" placeholder="Description" />
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setEditProduct(null)} className="px-4 py-2 bg-zinc-700 text-white rounded">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded">Update</button>
                </div>
              </form>
            </div>
          )}
          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
              <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
                  <div className="bg-zinc-800 p-6 rounded-lg shadow-lg w-full max-w-sm">
                      <h2 className="text-xl font-semibold text-white mb-4">Confirm Deletion</h2>
                      <p className="text-gray-300 mb-6">Are you sure you want to delete "{showDeleteConfirm.name}"?</p>
                      <div className="flex justify-end gap-4">
                          <button onClick={() => setShowDeleteConfirm(null)} className="px-4 py-2 bg-zinc-700 text-white rounded">Cancel</button>
                          <button onClick={() => handleDelete(showDeleteConfirm)} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
                      </div>
                  </div>
              </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MyProducts;
