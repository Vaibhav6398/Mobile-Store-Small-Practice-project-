import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import Editform from '../Components/ProfileForm'


export default function Home() {
    const userId = localStorage.getItem("userId");
    const [currentPage, setCurrentPage] = useState(1);
    const totalItems = 4;
    const [allData, setAllData] = useState([]);
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [showProducts, setShowProducts] = useState(false);
    const [searched, setSearched] = useState(false);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const [showEdit,setShowEdit]= useState(false);


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
            filtered = allData.filter(item =>
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
    function logout (){
        localStorage.clear();
        navigate("/auth");
    }
    function openModal(){
        setShowEdit(true);
    }

    const lastIndex = currentPage * totalItems;
    const firstIndex = lastIndex - totalItems;
    const currentData = data.slice(firstIndex, lastIndex);
    const totalPages = Math.ceil(data.length / totalItems);

    return (
        <div className="bg-gray-100 min-h-screen">
            {open && (
                <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xs z-50">
                    <div className="bg-white p-6 rounded-xl w-96 text-center">
                        Currently I can't help you
                        <button
                            onClick={() => setOpen(false)}
                            className="block mx-auto mt-4 bg-gray-200 rounded-2xl px-4 py-1.5"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
            {showEdit && (<Editform onClose={() => setShowEdit(false)} />)}

            <nav className="flex flex-wrap items-center gap-4 px-4 py-4 bg-white shadow mt-3">
                <img src="/logo1.png" alt="Logo" className="rounded-2xl w-10" />

                <ul className="gap-6 md:flex font-medium text-gray-700">
                    <li onClick={goHome} className="hover:text-yellow-500 cursor-pointer">Home</li>
                    <li onClick={openModal} className="hover:text-yellow-500 cursor-pointer">Edit Profile</li>
                    <li className="hover:text-yellow-500 cursor-pointer">About</li>
                </ul>

                <input
                    type="text"
                    placeholder="Search Items"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-black py-2 rounded-2xl pl-4"
                />

                <button
                    className="bg-gray-200 rounded-2xl px-4 py-1.5"
                    onClick={onSearch}
                >
                    Search
                </button>
                <button>{parseInt(userId) === 101 && (
                        <Link
                            to="/admin"
                            className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold"
                        >
                            Admin Panel
                        </Link>
                    )}</button>
                <button
                    className="bg-yellow-400 ml-auto px-4 py-2 rounded-full font-semibold text-sm"
                    onClick={showAllProducts}
                >
                    All Products
                </button>
                <button
                    className="bg-gray-800 text-white px-4 py-2 rounded-full font-semibold"
                    onClick={logout}
                >
                    Logout
                </button>

            </nav>

            {showProducts && data.length > 0 && (
                <>
                    <div className="px-4 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {currentData.map(item => (
                            <div
                                key={item.id}
                                className="bg-white rounded-2xl shadow-md hover:shadow-lg"
                            >
                                <div className="h-44 flex items-center justify-center">
                                    <img
                                        src={item.thumbnail}
                                        alt={item.title}
                                        className="h-full object-contain"
                                    />
                                </div>

                                <h2 className="mt-3 font-semibold ml-3">{item.title}</h2>

                                <p className="m-2 text-xs line-clamp-3 hover:line-clamp-none">
                                    {item.description}
                                </p>

                                <div className="flex items-center gap-3 mx-3 my-2">
                                    <span className="text-gray-400 line-through text-sm">
                                        ${item.price}
                                    </span>

                                    <span className="font-bold text-green-600">
                                        $
                                        {Math.round(
                                            (item.price -
                                                (item.price * item.discountPercentage) / 100) *
                                            100
                                        ) / 100}
                                    </span>

                                    <button
                                        onClick={() => setOpen(true)}
                                        className="px-3 bg-blue-200 rounded-2xl hover:bg-blue-400"
                                    >
                                        Buy
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center gap-5 pb-6">
                        {currentPage !== 1 && (
                            <button
                                className="bg-green-300 px-3 py-1 rounded-2xl"
                                onClick={() => setCurrentPage(currentPage - 1)}
                            >
                                Prev
                            </button>
                        )}

                        <span className="mt-1">
                            {currentPage} / {totalPages}
                        </span>

                        {currentPage !== totalPages && (
                            <button
                                className="bg-green-300 px-3 py-1 rounded-2xl"
                                onClick={() => setCurrentPage(currentPage + 1)}
                            >
                                Next
                            </button>
                        )}
                    </div>
                </>
            )}

            {showProducts && data.length === 0 && searched && (
                <div className="text-center mt-10 text-xl font-semibold text-gray-600">
                    No product found
                </div>
            )}

            {!showProducts && (
                <div className="flex px-4 py-6">
                    <img src="/Logo1.jpg" alt="Home" className="w-1/3" />
                    <p className="px-4">
                        Click <b>All Products</b> or use <b>Search</b> to view items.
                    </p>
                </div>
            )}
        </div>
    );
}
