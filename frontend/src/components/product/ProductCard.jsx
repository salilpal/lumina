import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div className="border rounded-lg shadow hover:shadow-md transition">
      <Link to={`/product/${product.slug}`}>
        <img
          src={product.images?.[0] || "/placeholder.jpg"}
          alt={product.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="p-4">
          <h3 className="font-semibold text-lg">{product.name}</h3>
          <p className="text-gray-600">
            {product.description?.slice(0, 60)}...
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
