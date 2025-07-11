import React, { useState, useRef, useEffect } from "react";
import "../style/d_style.css";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createProduct,
  fetchProducts,
  updateProduct,
} from "../redux/slice/product.slice";
import axios from "axios";
import { fetchSubcategories } from "../redux/slice/subcat.slice.jsx";
import { fetchCategories } from "../redux/slice/category.slice";

const ProductForm = () => {
  const [form, setForm] = useState({
    name: "",
    short_description: "",
    long_description: "",
    brand: "",
    weight: "",
    discount: "",
    pattern: "",
    price: "",
    category: "",
    subcategory: "",
    stock: "",
    lowstock: "",
    status: "active",
  });
  const [images, setImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const categoryRef = useRef(null);
  const { categories } = useSelector((state) => state.category);
  const safeCategories = Array.isArray(categories?.result)
    ? categories.result
    : Array.isArray(categories)
    ? categories
    : [];
  const categoryOptions = ["Crockery", "Cutlery", "Glassware", "Other"];
  const colorOptions = [
    "#254D70",
    "#E63946",
    "#F1C40F",
    "#2ECC40",
    "#8E44AD",
    "#F39C12",
    "#34495E",
    "#FFFFFF",
    "#000000",
  ];
  const colorNames = {
    "#254D70": "Blue",
    "#E63946": "Red",
    "#F1C40F": "Yellow",
    "#2ECC40": "Green",
    "#8E44AD": "Purple",
    "#F39C12": "Orange",
    "#34495E": "Dark Blue",
    "#FFFFFF": "White",
    "#000000": "Black",
  };
  const sizeOptions = [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "3XL",
    "4XL",
    "6 inch",
    "8 inch",
    "10 inch",
    "12 inch",
  ];
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [tempColor, setTempColor] = useState("#254D70"); // default color
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [subcategoryOpen, setSubcategoryOpen] = useState(false);
  const subcategoryRef = useRef(null);
  const { subcategories } = useSelector((state) => state.subcategory);
  const safeSubcategories = Array.isArray(subcategories?.result)
    ? subcategories.result
    : Array.isArray(subcategories)
    ? subcategories
    : [];

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchSubcategories());
    dispatch(fetchCategories());
    if (id && products && products.length > 0) {
      const prod = Array.isArray(products?.result)
        ? products.result.find((p) => p._id === id)
        : products.find((p) => p._id === id);
      if (prod) {
        setForm({
          name: prod.name || "",
          short_description: prod.short_description || "",
          long_description: prod.long_description || "",
          brand: prod.brand || "",
          weight: prod.weight || "",
          discount: prod.discount || "",
          pattern: prod.pattern || "",
          price: prod.price || "",
          category: prod.category_id?._id || prod.category_id || "",
          subcategory: prod.subcategory_id?._id || prod.subcategory_id || "",
          stock: prod.stock || "",
          lowstock: prod.lowstock || "",
          status: prod.active ? "active" : "inactive",
        });
        setSelectedColors(prod.colors || []);
        setSelectedSizes(prod.sizes || []);
        if (prod.images && prod.images.length > 0) {
          setImages(
            prod.images.map((img) => ({
              file: null,
              url: `http://localhost:5000/uploads/${img}`,
            }))
          );
        } else {
          setImages([]);
        }
      } else {
        setForm({
          name: "",
          short_description: "",
          long_description: "",
          brand: "",
          weight: "",
          discount: "",
          pattern: "",
          price: "",
          category: "",
          subcategory: "",
          stock: "",
          lowstock: "",
          status: "active",
        });
        setImages([]);
        setSelectedColors([]);
        setSelectedSizes([]);
      }
    }
  }, [id, products, dispatch]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setCategoryOpen(false);
      }
      if (
        subcategoryRef.current &&
        !subcategoryRef.current.contains(event.target)
      ) {
        setSubcategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation for dropdown
  const handleCategoryKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      setCategoryOpen((open) => !open);
    } else if (e.key === "Escape") {
      setCategoryOpen(false);
    }
  };

  const handleSubcategoryKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      setSubcategoryOpen((open) => !open);
    } else if (e.key === "Escape") {
      setSubcategoryOpen(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleRemoveImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImages({
        file: e.dataTransfer.files[0],
        url: URL.createObjectURL(e.dataTransfer.files[0]),
      });
    }
  };

  const handleImageClick = () => {
    inputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("short_description", form.short_description);
    formData.append("long_description", form.long_description);
    formData.append("brand", form.brand);
    formData.append("weight", form.weight);
    formData.append("discount", form.discount);
    formData.append("pattern", form.pattern);
    formData.append("price", form.price);
    formData.append("category_id", form.category);
    formData.append("subcategory_id", form.subcategory);
    formData.append("stock", form.stock);
    formData.append("lowstock", form.lowstock);
    formData.append("active", form.status === "active");
    selectedColors.forEach((color, idx) =>
      formData.append(`colors[${idx}]`, color)
    );
    selectedSizes.forEach((size, idx) =>
      formData.append(`sizes[${idx}]`, size)
    );
    images.forEach((img) => {
      if (img.file) formData.append("images", img.file);
    });

    try {
      if (id) {
        await dispatch(updateProduct({ id, formData })).unwrap();
        alert("Product Updated!");
      } else {
        await dispatch(createProduct(formData)).unwrap();
        alert("Product Added!");
      }
      dispatch(fetchProducts());
      navigate("/product/list");
    } catch (error) {
      console.error("Product create error:", error);
      alert(error);
    }
  };

  const handleColorToggle = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleSizeToggle = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleCustomColor = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev : [...prev, color]
    );
  };

  return (
    <div className="d_MP-container w-full mt-10 p-8 bg-white rounded-2xl shadow-2xl border border-[#254D70]/10">
      <h2 className="d_MP-title text-3xl font-extrabold mb-8 text-center tracking-wide">
        Add New Product
      </h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="mb-6">
          <h3 className="d_MP-section-title text-xl font-bold mb-4">
            Product Images
          </h3>
          <div
            className={`d_MP-dropzone flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer transition ${
              dragActive
                ? "border-[#254D70] bg-[#e6eef5]"
                : "border-[#b6c6d7] bg-[#f8fafc]"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleImageClick}
          >
            <input
              type="file"
              accept="image/*"
              ref={inputRef}
              onChange={handleImageChange}
              className="hidden"
              multiple
            />
            {images.length > 0 ? (
              <div className="flex flex-wrap gap-4 justify-center">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={img.url}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded-lg shadow border border-[#254D70]/30"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 text-red-500 shadow group-hover:scale-110 transition"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <svg
                  className="w-12 h-12 text-[#254D70]/60 mb-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 16V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v12M5 20h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2zm8-6l-2 2-2-2"
                  />
                </svg>
                <span className="text-[#254D70]/70 font-medium">
                  Drag & drop or click to upload (multiple allowed)
                </span>
              </>
            )}
          </div>
        </div>
        <div className="mb-6">
          <h3 className="d_MP-section-title text-xl font-bold mb-4">
            Product Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="d_MP-label block mb-2 font-semibold">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="d_MP-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#254D70]"
                required
                placeholder="Enter product name"
              />
            </div>
            <div>
              <label className="d_MP-label block mb-2 font-semibold">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                className="d_MP-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#254D70]"
                placeholder="Enter product brand"
              />
            </div>
            <div>
              <label className="d_MP-label block mb-2 font-semibold">
                Category
              </label>
              <div
                className={`d_MP-custom-dropdown${categoryOpen ? " open" : ""}`}
                tabIndex={0}
                ref={categoryRef}
                onClick={() => setCategoryOpen((open) => !open)}
                onKeyDown={handleCategoryKeyDown}
                aria-haspopup="listbox"
                aria-expanded={categoryOpen}
                role="button"
              >
                <div className="d_MP-dropdown-selected">
                  {form.category
                    ? safeCategories.find((cat) => cat._id === form.category)
                        ?.name
                    : "Select category"}
                  <span className="d_MP-dropdown-arrow">▼</span>
                </div>
                {categoryOpen && (
                  <ul className="d_MP-dropdown-list" role="listbox">
                    {safeCategories.map((option) => (
                      <li
                        key={option._id}
                        className={`d_MP-dropdown-option${
                          form.category === option._id ? " selected" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setForm({ ...form, category: option._id });
                          setCategoryOpen(false);
                        }}
                        role="option"
                        aria-selected={form.category === option._id}
                        tabIndex={-1}
                      >
                        {option.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div>
              <label className="d_MP-label block mb-2 font-semibold">
                Subcategory
              </label>
              <div
                className={`d_MP-custom-dropdown${
                  subcategoryOpen ? " open" : ""
                }`}
                tabIndex={0}
                ref={subcategoryRef}
                onClick={() => setSubcategoryOpen((open) => !open)}
                onKeyDown={handleSubcategoryKeyDown}
                aria-haspopup="listbox"
                aria-expanded={subcategoryOpen}
                role="button"
              >
                <div className="d_MP-dropdown-selected">
                  {form.subcategory
                    ? safeSubcategories.find(
                        (sub) => sub._id === form.subcategory
                      )?.name
                    : "Select subcategory"}
                  <span className="d_MP-dropdown-arrow">▼</span>
                </div>
                {subcategoryOpen && (
                  <ul className="d_MP-dropdown-list" role="listbox">
                    {safeSubcategories.map((option) => (
                      <li
                        key={option._id}
                        className={`d_MP-dropdown-option${
                          form.subcategory === option._id ? " selected" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setForm({ ...form, subcategory: option._id });
                          setSubcategoryOpen(false);
                        }}
                        role="option"
                        aria-selected={form.subcategory === option._id}
                        tabIndex={-1}
                      >
                        {option.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div>
              <label className="d_MP-label block mb-2 font-semibold">
                Pattern
              </label>
              <input
                type="text"
                name="pattern"
                value={form.pattern}
                onChange={handleChange}
                className="d_MP-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#254D70]"
                placeholder="Enter product pattern"
              />
            </div>
            <div>
              <label className="d_MP-label block mb-2 font-semibold">
                Weight
              </label>
              <input
                type="text"
                name="weight"
                value={form.weight}
                onChange={handleChange}
                className="d_MP-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#254D70]"
                placeholder="Enter product weight"
              />
            </div>
            <div>
              <label className="d_MP-label block mb-2 font-semibold">
                Short Description
              </label>
              <textarea
                name="short_description"
                value={form.short_description}
                onChange={handleChange}
                className="d_MP-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#254D70]"
                rows={3}
                required
                placeholder="Enter a short description of the product"
              />
            </div>
            <div>
              <label className="d_MP-label block mb-2 font-semibold">
                Long Description
              </label>
              <textarea
                name="long_description"
                value={form.long_description}
                onChange={handleChange}
                className="d_MP-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#254D70]"
                rows={5}
                placeholder="Enter a detailed description of the product"
              />
            </div>
            <div>
              <label className="d_MP-label block mb-2 font-semibold">
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="d_MP-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#254D70]"
                required
                placeholder="Enter price"
              />
            </div>
            <div>
              <label className="d_MP-label block mb-2 font-semibold">
                Discount (%)
              </label>
              <input
                type="number"
                name="discount"
                value={form.discount}
                onChange={handleChange}
                className="d_MP-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#254D70]"
                placeholder="Enter discount (optional)"
              />
            </div>
            <div>
              <label className="d_MP-label block mb-2 font-semibold">
                Stock Quantity
              </label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                className="d_MP-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#254D70]"
                required
                placeholder="Enter stock quantity"
              />
            </div>
            <div>
              <label className="d_MP-label block mb-2 font-semibold">
                Low Stock Threshold
              </label>
              <input
                type="number"
                name="lowstock"
                value={form.lowstock}
                onChange={handleChange}
                className="d_MP-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#254D70]"
                placeholder="Enter low stock threshold (optional)"
              />
            </div>
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                name="status"
                checked={form.status === "active"}
                onChange={handleChange}
                className="d_MP-checkbox mr-2"
              />
              <label className="d_MP-label">Active</label>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="d_MP-section-title text-xl font-bold mb-4">
            Colors & Sizes
          </h3>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Color Selector */}
            <div className="flex-1">
              <label className="d_MP-label block mb-2 font-semibold">
                Colors
              </label>
              <div className="d_MP-color-selector flex flex-wrap gap-2 mb-2 items-center">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`d_MP-color-swatch${
                      selectedColors.includes(color) ? " selected" : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorToggle(color)}
                    aria-label={color}
                  >
                    {selectedColors.includes(color) && (
                      <span className="d_MP-color-check">✔</span>
                    )}
                  </button>
                ))}
                {/* Color Picker */}
                <div
                  className="d_MP-gradient-palette"
                  title="Pick any color"
                  onClick={() => {
                    setColorPickerOpen(true);
                    document.getElementById("hidden-color-input").click();
                  }}
                >
                  <span className="d_MP-color-picker-icon">＋</span>
                  <input
                    id="hidden-color-input"
                    type="color"
                    style={{ display: "none" }}
                    value={tempColor}
                    onChange={(e) => setTempColor(e.target.value)}
                    onBlur={(e) => {
                      if (colorPickerOpen) {
                        handleCustomColor(tempColor);
                        setColorPickerOpen(false);
                      }
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedColors.map((color) => (
                  <span
                    key={color}
                    className="d_MP-chip"
                    style={{
                      backgroundColor: color,
                      color: "#fff",
                      borderColor: color,
                    }}
                  >
                    {colorNames[color] || color}
                    <button
                      type="button"
                      className="d_MP-chip-remove"
                      onClick={() => handleColorToggle(color)}
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
            {/* Size Selector */}
            <div className="flex-1">
              <label className="d_MP-label block mb-2 font-semibold">
                Sizes
              </label>
              <div className="d_MP-size-selector flex flex-wrap gap-2 mb-2">
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`d_MP-size-chip${
                      selectedSizes.includes(size) ? " selected" : ""
                    }`}
                    onClick={() => handleSizeToggle(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedSizes.map((size) => (
                  <span key={size} className="d_MP-chip d_MP-chip-size">
                    {size}
                    <button
                      type="button"
                      className="d_MP-chip-remove"
                      onClick={() => handleSizeToggle(size)}
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center">
          <button
            type="submit"
            className="d_MP-btn w-auto bg-[#254D70] text-white py-3 rounded-lg text-lg font-bold shadow hover:bg-[#1e3a56] transition"
          >
            {id ? "Update Product" : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
