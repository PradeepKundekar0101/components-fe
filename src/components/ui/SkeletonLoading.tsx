const ProductSkeleton = () => (
  <div className="flex gap-4 bg-gray-100 p-4 rounded animate-pulse">
    <div className="w-20 h-20 bg-gray-300 rounded"></div>
    <div className="flex-grow space-y-2">
      <div className="h-6 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      <div className="flex items-center gap-2">
        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
      </div>
    </div>
  </div>
);

export default ProductSkeleton;
