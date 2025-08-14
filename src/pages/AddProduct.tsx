import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { UploadIcon } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { supabase } from '../supabaseClient';

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    about: '',
    compatibleCars: '',
    images: [] as string[],
  });

  const seller_id = localStorage.getItem("seller_id");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (error) {
        toast.error('Failed to upload image.');
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      setProduct(prev => ({
        ...prev,
        images: [...prev.images, publicUrlData.publicUrl]
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seller_id) {
      toast.error("Seller not logged in.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post("https://backend-vale.onrender.com/api/seller/add-product", {
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description,
        about: JSON.stringify(product.about.split(',').map(s => s.trim())),
        car_models: JSON.stringify(product.compatibleCars.split(',').map(s => s.trim())),
        img: product.images[0] || "",
        seller_id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Product added successfully!');
      setProduct({
        name: '',
        price: '',
        category: '',
        description: '',
        about: '',
        compatibleCars: '',
        images: []
      });
    } catch (err) {
      toast.error('Failed to add product.');
    }
  };

  return (
    <div className="flex h-screen bg-zinc-900">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          <h1 className="text-2xl font-semibold text-white mb-6">
            Add New Product
          </h1>
          <form
            onSubmit={handleSubmit}
            className="bg-zinc-800 shadow-md rounded-lg p-6"
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300"
                >
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-zinc-600 rounded-md bg-zinc-700 text-white py-2 px-3"
                  value={product.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-300"
                >
                  Price (₹)
                </label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  required
                  className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-zinc-600 rounded-md bg-zinc-700 text-white py-2 px-3"
                  value={product.price}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-300"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  className="mt-1 block w-full py-2 px-3 border border-zinc-600 bg-zinc-700 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-white"
                  value={product.category}
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>
                  <option value="body-kits">Body Kits</option>
                  <option value="lighting">Lighting</option>
                  <option value="wheels">Wheels & Tires</option>
                  <option value="performance">Performance Parts</option>
                  <option value="interior">Interior Accessories</option>
                  <option value="interior">Suspension</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="compatibleCars"
                  className="block text-sm font-medium text-gray-300"
                >
                  Compatible Cars
                </label>
                <input
                  type="text"
                  name="compatibleCars"
                  id="compatibleCars"
                  className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-zinc-600 rounded-md bg-zinc-700 text-white py-2 px-3"
                  placeholder="e.g. Maruti Suzuki Swift 2022, Honda City 2020"
                  value={product.compatibleCars}
                  onChange={handleChange}
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="about"
                  className="block text-sm font-medium text-gray-300"
                >
                  About (comma separated)
                </label>
            
                <textarea
                  id="about"
                  name="about"
                  rows={2}
                  required
                  className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-zinc-600 rounded-md bg-zinc-700 text-white py-2 px-3"
                  placeholder="e.g. Lightweight, Durable, Stylish"
                  value={product.about}
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-300"
                >
                  Description
                </label>
              
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-zinc-600 rounded-md bg-zinc-700 text-white py-2 px-3"
                  value={product.description}
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300">
                  Product Images
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-zinc-600 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-400">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-zinc-700 rounded-md font-medium text-orange-500 hover:text-orange-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500"
                      >
                        <span className="px-2 py-1">Upload files</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          multiple
                          className="sr-only"
                          onChange={handleImageUpload}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-400">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>
              {product.images.length > 0 && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Uploaded Images
                  </label>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {product.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="h-24 w-full object-cover rounded-md"
                        />
                        <button
                          type="button"
                          className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 shadow-md"
                          onClick={() => {
                            const newImages = [...product.images];
                            newImages.splice(index, 1);
                            setProduct((prev) => ({
                              ...prev,
                              images: newImages,
                            }));
                          }}
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                className="mr-3 py-2 px-4 border border-zinc-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-zinc-700 hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Add Product
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default AddProduct;
