// src/pages/TypeProducts.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllProducts } from "../services/productService";
import ProductCard from "../components/product/ProductCard";

const TypeProducts = () => {
  const { typeSlug } = useParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeName, setTypeName] = useState("");

  useEffect(() => {
    const fetchAndFilter = async () => {
      setLoading(true);
      try {
        const res = await getAllProducts(); // GET /api/products
        const allProducts = res.products;

        const matched = allProducts.filter(
          (product) => product.type?.slug === typeSlug
        );

        setFilteredProducts(matched);
        setTypeName(matched[0]?.type?.name || typeSlug); // fallback to slug if no match
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndFilter();
  }, [typeSlug]);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 capitalize">
        Products in {typeName}
      </h1>

      {filteredProducts.length === 0 ? (
        <p className="text-gray-500">No products found under this type.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TypeProducts;
