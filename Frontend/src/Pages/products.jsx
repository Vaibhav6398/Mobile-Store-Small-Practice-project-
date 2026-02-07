import React from "react";

export default function Products() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4  flex-col">      
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Products
        </h1>

        <p className="text-gray-600 text-lg">
          Welcome to my Products page
        </p>

        <div className="mt-6">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
            Explore Products
          </button>
        </div>
    </div>
  );
}
