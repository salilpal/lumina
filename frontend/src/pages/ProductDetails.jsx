// src/pages/ProductDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductBySlug } from "../services/productService"; // ✅ Correct

import Loader from "../components/common/Loader";

const ProductDetails = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductBySlug(slug)
      .then((productData) => setProduct(productData))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loader />;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <img src={product.images[0]} alt={product.name} className="mb-4" />
      <p>{product.description}</p>
    </div>
  );
};

export default ProductDetails;
