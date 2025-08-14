import { useState, useEffect } from 'react';
import axios from "axios";
import { SearchIcon, FilterIcon, ChevronDownIcon } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const categories = ['All Categories', 'Engine', 'Exhaust', 'Suspension', 'Brakes', 'Exterior', 'Interior', 'Lighting', 'Wheels', 'Electronics', 'Drivetrain'];

const BuyParts = () => {
  type Product = {
    id: string | number;
    name: string;
    price: number | string;
    img: string;
    category?: string;
    rating?: number;
    description?: string;
  };

  const [Products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  useEffect(() => {
    axios.get("https://backend-vale.onrender.com/api/products")
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  // Filter products based on search and category
  const filteredProducts = Products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || product.category?.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return Number(a.price) - Number(b.price);
      case 'price-high':
        return Number(b.price) - Number(a.price);
      case 'rating':
        return (Number(b.rating) || 0) - (Number(a.rating) || 0);
      default:
        return 0;
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );


  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy]);

  return (
    <div className="w-full bg-zinc-900 pt-16">
      {/* Header */}
      <section className="bg-zinc-800 py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <pattern id="pattern-circles" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
              <circle id="pattern-circle" cx="10" cy="10" r="1.6" fill="#f97316"></circle>
            </pattern>
            <rect id="rect" x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"></rect>
          </svg>
        </div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Performance Parts & Accessories
            </h1>
            <p className="text-gray-300 mb-8">
              Browse our extensive collection of high-quality performance parts
              to elevate your ride to the next level.
            </p>
            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input type="text" className="block w-full pl-10 pr-3 py-3 border border-zinc-600 rounded-lg bg-zinc-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="Search for parts or accessories..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
          </div>
        </div>
      </section>
      {/* Products Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          {/* Filters and Sorting */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
            <div className="flex items-center">
              <button onClick={() => setShowFilters(!showFilters)} className="flex items-center text-sm bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg mr-4 transition-colors">
                <FilterIcon className="h-4 w-4 mr-2" />
                Filters
                <ChevronDownIcon className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              <div className="hidden md:flex items-center space-x-2">
                <span className="text-sm text-gray-400">Category:</span>
                <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="text-sm bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500">
                  {categories.map(category => <option key={category} value={category}>
                      {category}
                    </option>)}
                </select>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-400 mr-2">Sort by:</span>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="text-sm bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
          {/* Mobile Filters */}
          {showFilters && <div className="md:hidden bg-zinc-800 p-4 rounded-lg mb-6">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Category
                </label>
                <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="w-full text-sm bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500">
                  {categories.map(category => <option key={category} value={category}>
                      {category}
                    </option>)}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Price Range
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" placeholder="Min" className="w-full text-sm bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  <input type="number" placeholder="Max" className="w-full text-sm bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
              </div>
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                Apply Filters
              </button>
            </div>}
          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {paginatedProducts.map(product => (
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
          {/* No Results */}
          {sortedProducts.length === 0 && <div className="text-center py-20">
              <div className="text-5xl mb-4">😕</div>
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-gray-400 mb-6">
                Try adjusting your search or filter to find what you're looking
                for.
              </p>
              <button onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All Categories');
              }} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors">
                Clear Filters
              </button>
            </div>}
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-zinc-700 bg-zinc-800 text-sm font-medium text-gray-400 hover:bg-zinc-700 disabled:opacity-50"
                >
                  <span className="sr-only">Previous</span>
                  &lt;
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border border-zinc-700 ${currentPage === i + 1 ? 'bg-zinc-700 text-white' : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-zinc-700 bg-zinc-800 text-sm font-medium text-gray-400 hover:bg-zinc-700 disabled:opacity-50"
                >
                  <span className="sr-only">Next</span>
                  &gt;
                </button>
              </nav>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BuyParts;