import React, { useState, useRef, useEffect } from 'react';
import '../style/d_style.css';

const ProductForm = () => {
  const [form, setForm] = useState({ name: '', price: '', discount: '', category: '', stock: '', sku: '', description: '', tags: '', status: 'active', featured: false });
  const [images, setImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const categoryOptions = [
    'Crockery',
    'Cutlery',
    'Glassware',
    'Other',
  ];
  const categoryRef = useRef(null);
  const colorOptions = ['#254D70', '#E63946', '#F1C40F', '#2ECC40', '#8E44AD', '#F39C12', '#34495E', '#FFFFFF', '#000000'];
  const colorNames = { '#254D70': 'Blue', '#E63946': 'Red', '#F1C40F': 'Yellow', '#2ECC40': 'Green', '#8E44AD': 'Purple', '#F39C12': 'Orange', '#34495E': 'Dark Blue', '#FFFFFF': 'White', '#000000': 'Black' };
  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '6 inch', '8 inch', '10 inch', '12 inch'];
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [tempColor, setTempColor] = useState('#254D70'); // default color
  const [colorPickerOpen, setColorPickerOpen] = useState(false);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setCategoryOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation for dropdown
  const handleCategoryKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setCategoryOpen((open) => !open);
    } else if (e.key === 'Escape') {
      setCategoryOpen(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({ file, url: URL.createObjectURL(file) }));
    setImages(prev => [...prev, ...newImages]);
  };

  const handleRemoveImage = (idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
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
      setImages({ file: e.dataTransfer.files[0], url: URL.createObjectURL(e.dataTransfer.files[0]) });
    }
  };

  const handleImageClick = () => {
    inputRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    alert('Product Added!');
  };

  const handleColorToggle = (color) => {
    setSelectedColors((prev) => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]);
  };

  const handleSizeToggle = (size) => {
    setSelectedSizes((prev) => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  };

  const handleCustomColor = (color) => {
    setSelectedColors((prev) => prev.includes(color) ? prev : [...prev, color]);
  };

  return (
    <div className="d_MP-container w-full mt-10 p-8 bg-white rounded-2xl shadow-2xl border border-[#254D70]/10">
      <h2 className="d_MP-title text-3xl font-extrabold mb-8 text-center tracking-wide">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
      <div className="mb-6">
          <h3 className="d_MP-section-title text-xl font-bold mb-4">Product Images</h3>
          <div
            className={`d_MP-dropzone flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer transition ${dragActive ? 'border-[#254D70] bg-[#e6eef5]' : 'border-[#b6c6d7] bg-[#f8fafc]'}`}
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
                    <img src={img.url} alt="Preview" className="w-24 h-24 object-cover rounded-lg shadow border border-[#254D70]/30" />
                    <button type="button" onClick={() => handleRemoveImage(idx)} className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 text-red-500 shadow group-hover:scale-110 transition">
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <svg className="w-12 h-12 text-[#254D70]/60 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v12M5 20h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2zm8-6l-2 2-2-2" /></svg>
                <span className="text-[#254D70]/70 font-medium">Drag & drop or click to upload (multiple allowed)</span>
              </>
            )}
          </div>
        </div>
        <div className="mb-6">
          <h3 className="d_MP-section-title text-xl font-bold mb-4">Basic Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="d_MP-label block mb-2 font-semibold">Product Name</label>
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
              <label className="d_MP-label block mb-2 font-semibold">Category</label>
              <div
                className={`d_MP-custom-dropdown${categoryOpen ? ' open' : ''}`}
                tabIndex={0}
                ref={categoryRef}
                onClick={() => setCategoryOpen((open) => !open)}
                onKeyDown={handleCategoryKeyDown}
                aria-haspopup="listbox"
                aria-expanded={categoryOpen}
                role="button"
              >
                <div className="d_MP-dropdown-selected">
                  {form.category || 'Select category'}
                  <span className="d_MP-dropdown-arrow">▼</span>
                </div>
                {categoryOpen && (
                  <ul className="d_MP-dropdown-list" role="listbox">
                    {categoryOptions.map((option) => (
                      <li
                        key={option}
                        className={`d_MP-dropdown-option${form.category === option ? ' selected' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setForm({ ...form, category: option });
                          setCategoryOpen(false);
                        }}
                        role="option"
                        aria-selected={form.category === option}
                        tabIndex={-1}
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="d_MP-section-title text-xl font-bold mb-4">Pricing & Inventory</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="d_MP-label block mb-2 font-semibold">Price (₹)</label>
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
              <label className="d_MP-label block mb-2 font-semibold">Discount Price (₹)</label>
              <input
                type="number"
                name="discount"
                value={form.discount}
                onChange={handleChange}
                className="d_MP-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#254D70]"
                placeholder="Enter discount price (optional)"
              />
            </div>
            <div>
              <label className="d_MP-label block mb-2 font-semibold">Stock Quantity</label>
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
              <label className="d_MP-label block mb-2 font-semibold">SKU/Barcode</label>
              <input
                type="text"
                name="sku"
                value={form.sku}
                onChange={handleChange}
                className="d_MP-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#254D70]"
                placeholder="Enter SKU or barcode"
              />
            </div>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="d_MP-section-title text-xl font-bold mb-4">Colors & Sizes</h3>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Color Selector */}
            <div className="flex-1">
              <label className="d_MP-label block mb-2 font-semibold">Colors</label>
              <div className="d_MP-color-selector flex flex-wrap gap-2 mb-2 items-center">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`d_MP-color-swatch${selectedColors.includes(color) ? ' selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorToggle(color)}
                    aria-label={color}
                  >
                    {selectedColors.includes(color) && <span className="d_MP-color-check">✔</span>}
                  </button>
                ))}
                {/* Color Picker */}
                <div
                  className="d_MP-gradient-palette"
                  title="Pick any color"
                  onClick={() => {
                    setColorPickerOpen(true);
                    document.getElementById('hidden-color-input').click();
                  }}
                >
                  <span className="d_MP-color-picker-icon">＋</span>
                  <input
                    id="hidden-color-input"
                    type="color"
                    style={{ display: 'none' }}
                    value={tempColor}
                    onChange={e => setTempColor(e.target.value)}
                    onBlur={e => {
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
                  <span key={color} className="d_MP-chip" style={{ backgroundColor: color, color: '#fff', borderColor: color }}>
                    {colorNames[color] || color}
                    <button type="button" className="d_MP-chip-remove" onClick={() => handleColorToggle(color)}>&times;</button>
                  </span>
                ))}
              </div>
            </div>
            {/* Size Selector */}
            <div className="flex-1">
              <label className="d_MP-label block mb-2 font-semibold">Sizes</label>
              <div className="d_MP-size-selector flex flex-wrap gap-2 mb-2">
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`d_MP-size-chip${selectedSizes.includes(size) ? ' selected' : ''}`}
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
                    <button type="button" className="d_MP-chip-remove" onClick={() => handleSizeToggle(size)}>&times;</button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="d_MP-section-title text-xl font-bold mb-4">Description & Tags</h3>
          <div className="mb-4">
            <label className="d_MP-label block mb-2 font-semibold">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="d_MP-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#254D70]"
              rows={3}
              required
              placeholder="Describe the product"
            />
          </div>
          <div>
            <label className="d_MP-label block mb-2 font-semibold">Tags</label>
            <input
              type="text"
              name="tags"
              value={form.tags}
              onChange={handleChange}
              className="d_MP-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#254D70]"
              placeholder="e.g. dinner, plate, ceramic"
            />
            <span className="d_MP-helper text-xs text-gray-500">Comma separated</span>
          </div>
        </div>
       
     
<div className='w-full flex justify-center'>
<button type="submit" className="d_MP-btn w-auto bg-[#254D70] text-white py-3 rounded-lg text-lg font-bold shadow hover:bg-[#1e3a56] transition">Add Product</button>

</div>
      </form>
    </div>
  );
};

export default ProductForm; 