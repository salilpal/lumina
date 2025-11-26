// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import ProductGrid from "../components/product/ProductGrid";
import heroImage from "../assets/placeholder.jpg";
import heroVideo from "../assets/video2.mp4";
import { getCategories } from "../services/categoryService";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const cardAreaStyles = [
  "absolute top-[1%] left-[55%]",
  "absolute top-[30%] right-[55%]",
  "absolute top-[60%] left-[55%]",
  "absolute top-[90%] right-[55%]",
];

{
  /* There are problems here why left unevenly distributed. why top unevenly distributed*/
}
const labelAreaStyles = [
  "absolute top-[1%] left-4 text-[2rem]",
  "absolute top-[30%] right-4 text-[2rem]",
  "absolute top-[60%] left-4 text-[2rem]",
  "absolute top-[90%] right-4 text-[2rem]",
];

const Home = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data.categories.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="w-full h-[500vh]">
      {/* Hero Image */}
      <div className="mb-8 h-[70vh]">
        <video
          src={heroVideo}
          alt="Hero"
          className="w-full h-full object-cover shadow-lg"
          autoPlay
          loop
          muted
        />
      </div>

      {/* Categories Section */}
      <section className="relative h-[190vh]">
        {/* Optional: Section Heading & Button */}
        <div className="h-[5vh] flex items-center justify-between mb-2 mx-8">
          <h2 className="text-2xl font-semibold">Categories</h2>
          <button
            onClick={() => navigate("/categories")}
            className="text-blue-600 hover:underline"
          >
            Show All Categories
          </button>
        </div>
        <div className="relative w-full h-[190vh]">
          {/* Place category cards in hand-placed style */}
          {categories.map((category, idx) => (
            <React.Fragment key={category._id}>
              {/* Label */}
              <div
                className={`w-[35vh] h-[45vh] flex justify-center text-center items-center font-bold ${labelAreaStyles[idx]}`}
              >
                {category.name}
              </div>
              {/* Card */}
              <div
                className={`${cardAreaStyles[idx]} w-[35vh] h-[45vh] bg-white rounded-xl shadow-lg hover:shadow-xl transition cursor-pointer flex flex-col justify-center items-center`}
                onClick={() => navigate(`/categories/${category.slug}/types`)}
              >
                {category.image && (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="object-cover rounded-xl w-full h-full"
                    style={{ maxHeight: "100%", maxWidth: "100%" }}
                  />
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
