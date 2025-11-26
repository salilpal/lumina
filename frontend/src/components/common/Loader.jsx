import React from "react";
import loader from "../../assets/loader.svg";   

const Loader = () => {
  return (
    <div className="flex justify-center items-center py-10">
      <img src={loader} alt="Loading..." className="w-12 h-12 animate-spin" />
    </div>
  );
};

export default Loader;
