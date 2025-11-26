import React from "react";
import ProductCard from "./ProductCard";

const ProductGrid = ({ products }) => {
  if (!Array.isArray(products)) {
    return (
      <p className="text-gray-500 col-span-full text-center">
        No products found.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))
      ) : (
        <p className="text-gray-500 col-span-full text-center">
          No products found.
        </p>
      )}
    </div>
  );
};

export default ProductGrid;
