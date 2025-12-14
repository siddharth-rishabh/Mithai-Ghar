import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";

export default function ProductsPage() {
  const heroImages = [
    "/mithai-1.jpg",
    "/mithai-2.jpg",
    "/mithai-3.jpg",
    "/mithai-4.jpg",
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

 useEffect(() => {
  const interval = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  }, 3000);

  return () => clearInterval(interval);
}, [heroImages.length]);


  const products = [
    { id: 1, name: "Kaju Katli", price: "₹800 / kg", image: "/mithai-1.jpg" },
    { id: 2, name: "Gulab Jamun", price: "₹400 / kg", image: "/mithai-2.jpg" },
    { id: 3, name: "Rasgulla", price: "₹450 / kg", image: "/mithai-3.jpg" },
    { id: 4, name: "Ladoo", price: "₹350 / kg", image: "/mithai-4.jpg" },
    { id: 5, name: "Barfi", price: "₹500 / kg", image: "/mithai-3.jpg" },
    { id: 6, name: "Peda", price: "₹480 / kg", image: "/mithai-2.jpg" },
  ];

  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-orange-500 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-white rounded-full w-14 h-14 flex items-center justify-center">
            <span className="text-orange-500 font-bold text-sm">
              Mithai Ghar
            </span>
          </div>
        </div>

        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search sweets"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
        </div>

        <nav className="flex gap-6">
          <button className="text-white font-medium">Products</button>
          <button className="text-white font-medium">Logout</button>
        </nav>
      </header>

      <div className="w-full h-80 overflow-hidden relative">
        {heroImages.map((image, index) => (
          <img
            key={index}
            src={image}
            alt="Sweet display"
            className={`w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-700 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Our Sweets</h2>

        {filteredProducts.length === 0 ? (
          <p className="text-center text-gray-600">No sweets found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-orange-500 text-white p-4 text-center">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-sm">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
