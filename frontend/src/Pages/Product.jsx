import React, { useState } from "react";
import "../style/x_app.css";
import { FaCartPlus } from "react-icons/fa";
import { GrCart } from "react-icons/gr";

const categories = [
  "Man Shirt",
  "Man Jeans",
  "Woman Top",
  "Woman Jeans",
  "Man T-shirt",
];
const brands = ["Levi's", "Diesel", "Lee", "Hudson", "Denizen", "Spykar"];
const colors = [
  "bg-gray-300",
  "bg-white",
  "bg-black",
  "bg-green-400",
  "bg-orange-400",
  "bg-yellow-200",
  "bg-pink-300",
  "bg-blue-400",
];

// Crockery products data
const crockeryProducts = [
  {
    id: 1,
    name: "Ceramic Dinner Plate Set",
    price: 299,
    originalPrice: 399,
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
    category: "Plates",
    brand: "KitchenCraft",
    rating: 4.5,
    reviews: 128,
    discount: 25,
  },
  {
    id: 2,
    name: "Glass Water Glasses",
    price: 199,
    originalPrice: 249,
    image:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop",
    category: "Glasses",
    brand: "CrystalClear",
    rating: 4.3,
    reviews: 89,
    discount: 20,
  },
  {
    id: 3,
    name: "Stainless Steel Cutlery Set",
    price: 599,
    originalPrice: 799,
    image:
      "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=400&fit=crop",
    category: "Cutlery",
    brand: "PremiumSteel",
    rating: 4.7,
    reviews: 156,
    discount: 25,
  },
  {
    id: 4,
    name: "Porcelain Coffee Mugs",
    price: 149,
    originalPrice: 199,
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    category: "Mugs",
    brand: "MorningBrew",
    rating: 4.4,
    reviews: 203,
    discount: 25,
  },
  {
    id: 5,
    name: "Bamboo Serving Bowl",
    price: 399,
    originalPrice: 499,
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
    category: "Bowls",
    brand: "EcoKitchen",
    rating: 4.6,
    reviews: 67,
    discount: 20,
  },
  {
    id: 6,
    name: "Melamine Kids Plate Set",
    price: 249,
    originalPrice: 299,
    image:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop",
    category: "Kids",
    brand: "SafePlate",
    rating: 4.2,
    reviews: 94,
    discount: 17,
  },
];

const Product = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([""]);
  const [selectedBrands, setSelectedBrands] = useState([""]);
  const [price, setPrice] = useState([0, 1000]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [showColorPalette, setShowColorPalette] = useState(false);
  const filterRef = React.useRef(null);

  React.useEffect(() => {
    if (!showFilter) return;
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilter(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilter]);

  // Handle checkbox change
  const handleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
    setShowFilter(false);
  };
  const handleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
    setShowFilter(false);
  };
  const handleColor = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev : [...prev, color]
    );
    setShowColorPalette(false);
  };
  const handlePrice = (idx, value) => {
    let newPrice = [...price];
    newPrice[idx] = Number(value);
    // Ensure min <= max
    if (idx === 0 && newPrice[0] > newPrice[1]) newPrice[0] = newPrice[1];
    if (idx === 1 && newPrice[1] < newPrice[0]) newPrice[1] = newPrice[0];
    setPrice(newPrice);
    // Removed setShowFilter(false) so dropdown does not close on price change
  };

  return (
    <>
      <div className="flex flex-col md:flex-row items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
        {/* Filters Dropdown */}
        <div className="w-full md:w-1/6 relative col-3">
          <button
            className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none"
            onClick={() => setShowFilter(!showFilter)}
          >
            Filters
            <svg
              className={`w-4 h-4 ml-2 transition-transform ${
                showFilter ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {/* Overlay for mobile */}
          {showFilter && (
            <div
              className="fixed inset-0 bg-black bg-opacity-30 z-30 block md:hidden transition-transform duration-300 ease-in-out"
              onClick={() => setShowFilter(false)}
            />
          )}
          {/* Dropdown/Offcanvas */}
          <div
            ref={filterRef}
            className={`
                    z-40 bg-white border border-gray-200 rounded-md shadow-lg w-72 max-h-[80vh] overflow-y-auto
                    transition-all duration-300 ease-in-out
                    ${
                      window.innerWidth < 768
                        ? `fixed left-0 top-0 h-full rounded-none
                    ${
                      showFilter
                        ? "translate-x-0 opacity-100 pointer-events-auto"
                        : "-translate-x-full opacity-0 pointer-events-none"
                    }`
                        : `absolute left-0 top-14
                    ${
                      showFilter
                        ? "translate-y-0 opacity-100 pointer-events-auto"
                        : "-translate-y-4 opacity-0 pointer-events-none"
                    }`
                    }
                    `}
          >
            {/* Close btn for mobile */}
            <div className="flex justify-between items-center px-4 py-2 border-b md:hidden transition-transform duration-300 ease-in-out">
              <span className="font-semibold text-lg">Filters</span>
              <button onClick={() => setShowFilter(false)}>
                <svg
                  className="w-6 h-6 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-4">
              {/* Category */}
              <div>
                <h3 className="font-semibold text-lg mb-2">Category</h3>
                {categories.map((cat) => (
                  <label
                    key={cat}
                    className="x_checkbox_label flex items-center mb-1 cursor-pointer transition-transform duration-300"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => handleCategory(cat)}
                      className="x_checkbox accent-blue-500 w-4 h-4 mr-2"
                    />
                    <span className="text-gray-700">{cat}</span>
                  </label>
                ))}
              </div>
              {/* Brand */}
              <div className="mt-4">
                <h3 className="font-semibold text-lg mb-2">Brand</h3>
                {brands.map((brand) => (
                  <label
                    key={brand}
                    className="x_checkbox_label flex items-center mb-1 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrand(brand)}
                      className="x_checkbox accent-blue-500 w-4 h-4 mr-2"
                    />
                    <span className="text-gray-700">{brand}</span>
                  </label>
                ))}
              </div>
              {/* Colors */}
              <div className="mt-4">
                <h3 className="font-semibold text-lg mb-2">Colors</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  {colors.map((color, idx) => (
                    <span
                      key={idx}
                      className={`w-6 h-6 rounded-full border border-gray-300 ${color} inline-block cursor-pointer`}
                      onClick={() => {
                        handleColor(color);
                        setShowColorPalette(false);
                      }}
                    ></span>
                  ))}
                </div>
              </div>
              {/* Price Range Slider */}
              <div className="x_price_slider_wrapper mt-4">
                <h3 className="font-semibold text-lg mb-2">Price</h3>
                <div className="flex flex-col items-center">
                  <div className="x_price_labels w-full flex justify-between text-sm mb-2">
                    <span className="x_price_min">${`$${price[0]}`}</span>
                    <span className="x_price_max">${`$${price[1]}`}</span>
                  </div>
                  <div
                    className="x_price_slider_track relative w-full flex items-center"
                    style={{ height: "40px" }}
                  >
                    {/* Min slider */}
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="10"
                      value={price[0]}
                      onChange={(e) => handlePrice(0, e.target.value)}
                      className="x_price_slider absolute w-full pointer-events-auto h-2"
                      style={{ zIndex: price[0] > price[1] - 100 ? 5 : 3 }}
                    />
                    {/* Max slider */}
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="10"
                      value={price[1]}
                      onChange={(e) => handlePrice(1, e.target.value)}
                      className="x_price_slider absolute w-full pointer-events-auto h-2"
                      style={{ zIndex: 4 }}
                    />
                  </div>
                  <div className="x_price_scale w-full flex justify-between text-xs text-gray-400 mt-1">
                    <span>0</span>
                    <span>250</span>
                    <span>500</span>
                    <span>750</span>
                    <span>1000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Search Input */}
        <div className="relative flex-1 w-full col-9">
          <input
            type="text"
            placeholder="Search.."
            className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
        </div>
      </div>
      {/* Selected Filters Tags */}
      <div className="container mx-auto px-2">
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedCategories
            .filter((c) => c)
            .map((cat) => (
              <span key={cat} className="x_filter_tag">
                {cat}
                <button
                  className="x_filter_tag_close"
                  onClick={() =>
                    setSelectedCategories(
                      selectedCategories.filter((c) => c !== cat)
                    )
                  }
                >
                  &times;
                </button>
              </span>
            ))}
          {selectedBrands
            .filter((b) => b)
            .map((brand) => (
              <span key={brand} className="x_filter_tag">
                {brand}
                <button
                  className="x_filter_tag_close"
                  onClick={() =>
                    setSelectedBrands(selectedBrands.filter((b) => b !== brand))
                  }
                >
                  &times;
                </button>
              </span>
            ))}
          {/* <span className="x_filter_tag cursor-pointer" onClick={() => setShowColorPalette(v => !v)}>
          Color
        </span>
        {showColorPalette && (
          <div className="absolute z-50 mt-2 left-24 flex gap-2 bg-white p-2 rounded-lg shadow border border-gray-200">
            {colors.map((color, idx) => (
              <span
                key={idx}
                className={`w-6 h-6 rounded-full border border-gray-300 ${color} inline-block cursor-pointer`}
                onClick={() => handleColor(color)}
              ></span>
            ))}
          </div>
        )} */}
          {selectedColors.map((color, idx) => (
            <span
              key={color}
              className={`x_filter_tag x_color_tag`}
              style={{ background: "transparent", padding: 0, border: "none" }}
            >
              <span
                className={`w-6 h-6 rounded-full border border-gray-300 ${color} inline-block`}
                style={{ margin: "0 2px" }}
              ></span>
              <button
                className="x_filter_tag_close"
                onClick={() =>
                  setSelectedColors(selectedColors.filter((c) => c !== color))
                }
              >
                &times;
              </button>
            </span>
          ))}
        </div>

        {/* Product Cards */}
        <div className="x_product_grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 mt-8">
          {crockeryProducts.map((product) => (
            <div
              key={product.id}
              className="x_product_card group bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
            >
              {/* Product Image Container */}
              <div className="x_product_image_container relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="x_product_image w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {/* Discount Badge */}
                <div className="x_discount_badge absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {product.discount}% OFF
                </div>
                {/* Quick Actions */}
                <div className="x_quick_actions absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="x_action_btn w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors">
                    <svg
                      className="w-4 h-4 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                  <button className="x_action_btn w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors">
                    {/* <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg> */}

                    <GrCart className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="x_product_info p-4">
                {/* Category & Brand */}
                <div className="x_product_meta flex items-center gap-2 mb-2">
                  <span className="x_category text-xs x_blue bg-blue-50 px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                  <span className="x_brand text-xs text-gray-500">
                    {product.brand}
                  </span>
                </div>

                {/* Product Name */}
                <h3 className="x_product_name text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:x_blue transition-colors">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="x_rating_container flex items-center gap-2 mb-3">
                  <div className="x_stars flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="x_rating_text text-sm text-gray-600">
                    {product.rating} ({product.reviews})
                  </span>
                </div>

                {/* Price */}
                <div className="x_price_container flex items-center gap-2">
                  <span className="x_current_price text-xl font-bold text-gray-900">
                    ₹{product.price}
                  </span>
                  <span className="x_original_price text-sm text-gray-500 line-through">
                    ₹{product.originalPrice}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Product;
