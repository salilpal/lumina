// src/pages/CategoryTypes.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCategories, getTypesByCategory } from "../services/categoryService";

const CategoryTypes = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [types, setTypes] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        const found = data.categories.find((cat) => cat.slug === slug);

        if (found) {
          setCategoryName(found.name);
          const typesData = await getTypesByCategory(found._id);
          setTypes(typesData.types || typesData); // handle both formats
        }
      } catch (err) {
        console.error("Error fetching types", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTypes();
  }, [slug]);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Types in {categoryName}</h1>

      {types.length === 0 ? (
        <p className="text-gray-500">No types found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {types.map((type) => (
            <div
              key={type._id}
              className="bg-white p-4 rounded shadow hover:shadow-md transition cursor-pointer text-center"
              onClick={() => navigate(`/types/${type.slug}/products`)}
            >
              <img
                src={type.image}
                alt={type.name}
                className="w-full h-28 object-cover rounded mb-2"
              />
              <h2 className="text-xl font-semibold">{type.name}</h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryTypes;
