import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsforshop } from "../redux/slice/product.slice";
import { createCart, addOrUpdateProduct, fetchCarts } from "../redux/slice/cart.slice";
import "../style/x_app.css";
import { GrCart } from "react-icons/gr";
import { MdShoppingCart } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const categories = [
  "Man Shirt",
  "Man Jeans",
  "Woman Top",
  "Woman Jeans",
  "Man T-shirt",
];
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

const Product = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [price, setPrice] = useState([0, 1000]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [addingToCart, setAddingToCart] = useState(null);
  const filterRef = React.useRef(null);
  const dispatch = useDispatch();
  const { products = [], loading, error } = useSelector((state) => state.product) || {};
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);
  const [search, setSearch] = useState("");
  const { carts = [] } = useSelector((state) => state.cart) || {};
  const authState = useSelector((state) => state.auth);
  console.log("authState:", authState);
  const user = authState?.user;
  const navigate = useNavigate();
  

  const { categories = [] } = useSelector((state) => state.category) || {};
  const safeCategories = Array.isArray(categories?.result)
    ? categories.result
    : Array.isArray(categories)
      ? categories
      : [];

  const { subcategories = [] } = useSelector((state) => state.subcategory) || {};
  const safeSubcategories = Array.isArray(subcategories?.result)
    ? subcategories.result
    : Array.isArray(subcategories)
      ? subcategories
      : [];

  useEffect(() => {
    dispatch(fetchProductsforshop());
  }, [dispatch]);

  // Auto-close filter offcanvas on window resize to <= 767px
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth <= 767) {
        setShowFilter(false);
      }
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
  const handleCategory = (catId) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
    // If a subcategory is selected that doesn't belong to any selected category, clear it
    setSelectedSubcategoryId((prevSubId) => {
      if (!prevSubId) return prevSubId;
      const sub = safeSubcategories.find((s) => s._id === prevSubId);
      if (!sub || !selectedCategories.includes(sub.category_id?._id)) {
        return null;
      }
      return prevSubId;
    });
  };

  const handleSubcategory = (subId) => {
    setSelectedSubcategoryId((prev) => (prev === subId ? null : subId));
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

  // Cart functionality from try.js
  useEffect(() => {
    // Fetch user's carts when component mounts
    if (user) {
      dispatch(fetchCarts());
    }
  }, [dispatch, user]);

  const handleAddToCart = async (product) => {
    console.log("user in handleAddToCart:", user);
    if (!user) {
      alert('User not logged in');
      return;
    }

    try {
      setAddingToCart(product._id);
      const userCart = carts.find(cart => cart.user_id === user._id);

      if (!userCart) {
        // No cart exists - create new cart with the product
        const cartData = {
          user_id: user._id,
          products: [
            {
              product_id: product._id,
              quantity: 1
            }
          ]
        };
        await dispatch(createCart(cartData)).unwrap();
      } else {
        // Cart exists - check if product is already in cart
        const existingProduct = userCart.products?.find(
          p => p.product_id === product._id
        );

        if (existingProduct) {
          const updateData = {
            cart_id: userCart._id,
            product_id: product._id,
            quantity: existingProduct.quantity + 1
          };
          await dispatch(addOrUpdateProduct(updateData)).unwrap();
        }
      }

      dispatch(fetchCarts());
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(null);
    }
  };

  // Filter products based on selected category and subcategory
  let displayProducts = products;

  // Calculate min and max price from products
  const prices = products.map(p => p.price).filter(Boolean);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 1000;

  // Filter by price
  displayProducts = displayProducts.filter(
    p => p.price >= price[0] && p.price <= price[1]
  );

  // Filter by color
  if (selectedColors.length > 0) {
    displayProducts = displayProducts.filter(
      p => (p.colors || []).some(c =>
        selectedColors.includes(typeof c === 'string' ? c : c.name || c.code)
      )
    );
  }

  if (selectedSubcategoryId) {
    displayProducts = displayProducts.filter(
      (p) =>
        p.subcategory_id &&
        (p.subcategory_id._id === selectedSubcategoryId ||
          p.subcategory_id === selectedSubcategoryId)
    );
  } else if (selectedCategories.length > 0) {
    displayProducts = displayProducts.filter(
      (p) =>
        p.category_id &&
        selectedCategories.includes(p.category_id._id || p.category_id)
    );
  }

  // Filter by search
  if (search.trim() !== "") {
    const searchLower = search.toLowerCase();
    displayProducts = displayProducts.filter((p) => {
      const nameMatch = p.name && p.name.toLowerCase().includes(searchLower);
      const catMatch = p.category_id && (p.category_id.name || "").toLowerCase().includes(searchLower);
      const subcatMatch = p.subcategory_id && (p.subcategory_id.name || "").toLowerCase().includes(searchLower);
      return nameMatch || catMatch || subcatMatch;
    });
  }

  useEffect(() => {
    if (prices.length) {
      setPrice([minPrice, maxPrice]);
    }
    // eslint-disable-next-line
  }, [products]);

  const allColors = Array.from(
    new Set(
      products
        .flatMap(p => p.colors || [])
        .map(c => typeof c === 'string' ? c : c.name || c.code || '')
        .filter(Boolean)
    )
  );

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
              className={`w-4 h-4 ml-2 transition-transform ${showFilter ? "rotate-180" : ""
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
          {/* Offcanvas (Right Side, below header on large screens) */}
          <div
            ref={filterRef}
            className={`
              z-40 bg-white border border-gray-200 rounded-md shadow-lg w-72  overflow-y-auto
              transition-all duration-300 ease-in-out
              fixed right-0
              ${window.innerWidth < 768
                ? 'top-0 h-full rounded-none'
                : 'top-[80px] h-[calc(100vh-80px)]'}
              ${showFilter
                ? 'translate-x-0 opacity-100 pointer-events-auto'
                : 'translate-x-full opacity-0 pointer-events-none'}
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
                {safeCategories.map((cat) => (
                  <label
                    key={cat._id}
                    className="x_checkbox_label flex items-center mb-1 cursor-pointer transition-transform duration-300"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat._id)}
                      onChange={() => handleCategory(cat._id)}
                      className="x_checkbox accent-blue-500 w-4 h-4 mr-2"
                    />
                    {/* Show category image if available */}
                    {cat.image && (
                      <img
                        src={`http://localhost:5000/uploads/${cat.image}`}
                        alt={cat.name}
                        style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'cover', marginRight: 8, border: '1px solid #eee' }}
                      />
                    )}
                    <span className="text-gray-700">{cat.name}</span>
                  </label>
                ))}
              </div>
               {/* Subcategory */}
              {selectedCategories.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <h3 className="font-semibold text-lg mb-2">Subcategory</h3>
                  {safeSubcategories.map((sub) => {
                    // If categories are selected, only enable subcategories that belong to them
                    const isEnabled =
                      selectedCategories.length === 0 ||
                      selectedCategories.includes(sub.category_id?._id);

                    return (
                      <label
                        key={sub._id}
                        className={`x_checkbox_label flex items-center mb-1 cursor-pointer transition-transform duration-300 ${!isEnabled ? 'opacity-50 pointer-events-none' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedSubcategoryId === sub._id}
                          onChange={() => {
                            if (isEnabled) handleSubcategory(sub._id);
                          }}
                          className="x_checkbox accent-blue-500 w-4 h-4 mr-2"
                          disabled={!isEnabled}
                        />
                        {sub.image && (
                          <img
                            src={`http://localhost:5000/uploads/${sub.image}`}
                            alt={sub.name}
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: 6,
                              objectFit: 'cover',
                              marginRight: 8,
                              border: '1px solid #eee',
                            }}
                          />
                        )}
                        <span className="text-gray-700">{sub.name}</span>
                      </label>
                    );
                  })}
                </div>
              )}
              {/* Colors */}
              <div className="mt-4">
                <h3 className="font-semibold text-lg mb-2">Colors</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  {allColors.map((color, idx) => (
                    <span
                      key={color + idx}
                      className={`w-6 h-6 rounded-full border border-gray-300 inline-block cursor-pointer`}
                      style={{ background: color, margin: '0 2px' }}
                      onClick={() => handleColor(color)}
                    ></span>
                  ))}
                </div>
              </div>
              {/* Price Range Slider */}
              <div className="x_price_slider_wrapper mt-4">
                <h3 className="font-semibold text-lg mb-2">Price</h3>
                <div className="flex flex-col items-center">
                  <div className="x_price_labels w-full flex justify-between text-sm mb-2">
                    <span className="x_price_min">{`$${price[0]}`}</span>
                    <span className="x_price_max">{`$${price[1]}`}</span>
                  </div>
                  <div
                    className="x_price_slider_track relative w-full flex items-center"
                    style={{ height: "40px" }}
                  >
                    {/* Min slider */}
                    <input
                      type="range"
                      min={minPrice}
                      max={maxPrice}
                      step="10"
                      value={price[0]}
                      onChange={(e) => handlePrice(0, e.target.value)}
                      className="x_price_slider absolute w-full pointer-events-auto h-2"
                      style={{ zIndex: price[0] > price[1] - 100 ? 5 : 3 }}
                    />
                    {/* Max slider */}
                    <input
                      type="range"
                      min={minPrice}
                      max={maxPrice}
                      step="10"
                      value={price[1]}
                      onChange={(e) => handlePrice(1, e.target.value)}
                      className="x_price_slider absolute w-full pointer-events-auto h-2"
                      style={{ zIndex: 4 }}
                    />
                  </div>
                  <div className="x_price_scale w-full flex justify-between text-xs text-gray-400 mt-1">
                    <span>100</span>
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
            value={search}
            onChange={e => setSearch(e.target.value)}
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
            .map((catId) => {
              const catObj = safeCategories.find(c => c._id === catId);
              return (
                <span key={catId} className="x_filter_tag">
                  {catObj ? catObj.name : catId}
                  <button
                    className="x_filter_tag_close"
                    onClick={() =>
                      setSelectedCategories(
                        selectedCategories.filter((c) => c !== catId)
                      )
                    }
                  >
                    &times;
                  </button>
                </span>
              );
            })
          }
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
          {loading ? (
            <div className="col-span-full text-center text-lg">Loading...</div>
          ) : error ? (
            <div className="col-span-full text-center text-red-500">{error}</div>
          ) : Array.isArray(displayProducts) && displayProducts.length > 0 ? (
            displayProducts.map((product) => (
              // console.log(product)
              
              <div
                key={product._id || product.id}
                className="x_product_card group bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
                
                style={{ cursor: "pointer" }}
              >
                {/* Product Image Container */}
                <div className="x_product_image_container relative overflow-hidden">
                  <img
                    src={
                      `http://localhost:5000/uploads/${product.images}`
                    }
                    alt={product.name}
                    className="x_product_image w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {/* Discount Badge */}
                  {product.discount && (
                    <div className="x_discount_badge absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {product.discount}% OFF
                    </div>
                  )}
                  {/* Quick Actions */}
                  <div className="x_quick_actions absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {/* <button className="x_action_btn w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors">
                      <FaRegEye className="w-4 h-4 text-gray-600" />
                    </button> */}
                    <button className="x_action_btn w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors"
                      onClick={() => handleAddToCart(product)}
                      disabled={addingToCart === product._id}
                    >
                      {addingToCart === product._id ? (
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                      ) : (
                        <GrCart className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="x_product_info p-4" onClick={() => navigate(`/product/detail?id=${product._id}`)}>
                  {/* Category & Brand */}
                  <div className="x_product_meta flex items-center gap-2 mb-2">
                    <span className="x_category text-xs x_blue bg-blue-50 px-2 py-1 rounded-full">
                      {product.category_id.name || "-"}
                    </span>
                    <span className="x_brand text-xs text-gray-500">
                      {product.brand || "-"}
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
                          className={`w-4 h-4 ${i < Math.floor(product.rating || 0)
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
                      {product.rating || 0} ({product.reviews || 0})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="x_price_container flex items-center gap-2">
                    <span className="x_current_price text-xl font-bold text-gray-900">
                      ₹{product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="x_original_price text-sm text-gray-500 line-through">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">No products found.</div>
          )}
        </div>
      </div>
    </>
  );
};

export default Product;
