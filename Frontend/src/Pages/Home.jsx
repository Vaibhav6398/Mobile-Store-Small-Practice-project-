import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Editform from "../Components/ProfileForm";

export default function Home() {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = 4;
  const [allData, setAllData] = useState([]);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [showProducts, setShowProducts] = useState(false);
  const [searched, setSearched] = useState(false);
  const [open, setOpen] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const API = "https://dummyjson.com/products/category/smartphones";

  useEffect(() => {
    async function fetchAll() {
      const res = await axios.get(API);
      setAllData(res.data.products);
    }
    fetchAll();
  }, []);

  function showAllProducts() {
    setData(allData);
    setShowProducts(true);
    setSearched(false);
    setCurrentPage(1);
  }

  function onSearch() {
    setSearched(true);
    let filtered = [];

    if (!search.trim()) {
      filtered = allData;
    } else {
      filtered = allData.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    setData(filtered);
    setShowProducts(true);
    setCurrentPage(1);
  }

  function goHome() {
    setShowProducts(false);
    setData([]);
    setSearch("");
    setCurrentPage(1);
    setSearched(false);
  }

  function logout() {
    localStorage.clear();
    navigate("/auth");
  }

  const lastIndex = currentPage * totalItems;
  const firstIndex = lastIndex - totalItems;
  const currentData = data.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(data.length / totalItems);

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-300 min-h-screen overflow-hidden">

      {/* BUY MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-6 rounded-3xl shadow-xl text-center w-80">
            <h2 className="font-bold text-lg mb-2">Oops 😅</h2>
            <p className="text-gray-600">Buying is disabled for now</p>
            <button
              onClick={() => setOpen(false)}
              className="mt-4 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-full"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showEdit && <Editform onClose={() => setShowEdit(false)} />}

      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 bg-gradient-to-r from-gray-900 to-gray-700 text-white shadow-lg px-6 py-4 flex items-center gap-4">
        <div className="flex items-center gap-3">
          <img src="/logo1.png" className="w-10 rounded-xl" alt="logo" />
          <span className="font-extrabold text-lg">ShopEase</span>
        </div>

        <ul className="hidden md:flex gap-8 ml-10 font-medium">
          <li onClick={goHome} className="hover:text-yellow-400 cursor-pointer">
            Home
          </li>
          <li
            onClick={() => setShowEdit(true)}
            className="hover:text-yellow-400 cursor-pointer"
          >
            Profile
          </li>

          <li className="relative group cursor-pointer">
            <span className="hover:text-yellow-400">Products ▾</span>
            <div className="absolute hidden group-hover:block bg-white text-gray-800 mt-3 rounded-xl shadow-lg w-44 overflow-hidden">
              <p
                onClick={showAllProducts}
                className="px-4 py-2 hover:bg-gray-100"
              >
                All Products
              </p>
              <p className="px-4 py-2 hover:bg-gray-100">
                Active Products
              </p>
              <p className="px-4 py-2 hover:bg-gray-100">
                Out of Stock
              </p>
            </div>
          </li>
        </ul>

        <div className="ml-auto flex items-center gap-3">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-full text-white outline-amber-100 outline-2"
          />

          <button
            onClick={onSearch}
            className="bg-yellow-400 hover:bg-yellow-500 px-5 py-2 rounded-full font-semibold text-black"
          >
            Search
          </button>

          {parseInt(userId) === 101 && (
            <Link
              to="/admin"
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full font-semibold"
            >
              Admin
            </Link>
          )}

          <button
            onClick={logout}
            className="bg-black hover:bg-gray-900 px-4 py-2 rounded-full font-semibold"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* HERO / LANDING */}
      {!showProducts && (
        <div className="h-[calc(100vh-80px)] grid grid-cols-1 md:grid-cols-2 items-center px-12">
          <div>
            <h1 className="text-5xl font-extrabold text-gray-800">
              Welcome to <span className="text-yellow-500">ShopEase</span>
            </h1>

            <p className="mt-6 text-lg text-gray-600 max-w-xl">
              ShopEase is a modern shopping platform built for speed,
              simplicity, and smart browsing. Discover premium smartphones
              with a smooth and beautiful UI.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 max-w-md">
              <div className="bg-white p-4 rounded-2xl shadow">⚡ Fast UI</div>
              <div className="bg-white p-4 rounded-2xl shadow">🔒 Secure</div>
              <div className="bg-white p-4 rounded-2xl shadow">🎨 Premium</div>
              <div className="bg-white p-4 rounded-2xl shadow">📱 Devices</div>
            </div>

            <button
              onClick={showAllProducts}
              className="mt-10 bg-yellow-400 hover:bg-yellow-500 px-8 py-3 rounded-full font-bold shadow-lg"
            >
              Explore Products →
            </button>
          </div>

          <img
            src="/Logo1.jpg"
            alt="hero"
            className="w-full max-w-md mx-auto rounded-3xl shadow-2xl"
          />
        </div>
      )}

      {/* PRODUCTS */}
      {showProducts && data.length > 0 && (
        <>
          <div className="px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {currentData.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition"
              >
                <div className="h-44 flex items-center justify-center">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="h-full object-contain"
                  />
                </div>

                <h2 className="mt-3 font-semibold px-4">{item.title}</h2>

                <p className="px-4 mt-2 text-sm text-gray-600 line-clamp-3">
                  {item.description}
                </p>

                <div className="flex items-center justify-between px-4 py-4">
                  <span className="font-bold text-green-600">${item.price}</span>
                  <button
                    onClick={() => setOpen(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-full"
                  >
                    Buy
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center gap-6 pb-10">
            {currentPage !== 1 && (
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                className="bg-green-400 hover:bg-green-500 text-white px-4 py-1.5 rounded-full"
              >
                Prev
              </button>
            )}

            <span className="font-semibold">
              {currentPage} / {totalPages}
            </span>

            {currentPage !== totalPages && (
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="bg-green-400 hover:bg-green-500 text-white px-4 py-1.5 rounded-full"
              >
                Next
              </button>
            )}
          </div>
        </>
      )}

      {showProducts && data.length === 0 && searched && (
        <div className="flex items-center justify-center h-[60vh] text-gray-600">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">No Results Found</h2>
            <button
              onClick={showAllProducts}
              className="bg-yellow-400 hover:bg-yellow-500 px-6 py-2 rounded-full font-semibold"
            >
              View All Products
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
