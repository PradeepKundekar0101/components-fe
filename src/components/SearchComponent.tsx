import { useState } from 'react';
import { Search } from 'lucide-react';
import { mockProductsType } from '../data/productsData';

type mockProducts = {
  products: mockProductsType[]
};

const ComponentSearch = ({ products }: mockProducts) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(product =>
    product.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="text-red-600 text-2xl">⚡</div>
        <h1 className="text-red-600 text-xl font-semibold">Components Search</h1>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search components..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 pr-12 border border-gray-300 rounded"
        />
        <button className="absolute right-0 top-0 h-full px-4 bg-red-600 rounded-r">
          <Search className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* Product List */}
      <div className="space-y-4">
        {filteredProducts.map((product: mockProductsType) => (
          <div key={product.url} className="flex gap-4 bg-gray-100 p-4 rounded">
            {/* Product Image */}
            <img
              src={product.product_image_url}
              alt={product.productName}
              className="object-contain w-24 h-24 rounded flex items-center justify-center"
            />

            {/* Product Info */}
            <div className="flex-grow">
              <h2 className="text-lg font-medium mb-2">{product.productName}</h2>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1">
                  <span className="font-semibold">₹ {product.price}</span>
                </div>
                {product.isAvailable && (
                  <div className="bg-yellow-100 px-2 py-1 rounded text-sm">
                    Avl.Qty: {product.quantity}
                  </div>
                )}
                {/* Company Logo */}
                <img
                  src={product.company_logo}
                  alt="Company"
                  className="h-6 object-contain ml-auto"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComponentSearch;