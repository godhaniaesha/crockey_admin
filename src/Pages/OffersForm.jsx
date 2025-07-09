import { useRef, useState } from "react";

const OffersForm = () => {
    const [form, setForm] = useState({ category: '', subCategory: '', productname: '', offersName: '', code: '', status: false, startDate: '', endDate: '', discount: '', price: '' });
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [subCategoryOpen, setSubCategoryOpen] = useState(false);
    const categoryOptions = [
        'Crockery',
        'Cutlery',
        'Glassware',
        'Other',
    ];
    const subcategoryOptions = [
        'Dinner Set',
        'Spoon',
        'Glass',
        'Other',
    ];
    const categoryRef = useRef(null);
    const subCategoryRef = useRef(null);

    // Keyboard navigation for dropdown
    const handleCategoryKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            setCategoryOpen((open) => !open);
        } else if (e.key === 'Escape') {
            setCategoryOpen(false);
        }
    };
    const handleSubCategoryKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            setSubCategoryOpen((open) => !open);
        } else if (e.key === 'Escape') {
            setSubCategoryOpen(false);
        }
    };
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        alert('Offers Added!');
    };

    return (
        <div className="d_MP-container w-full mt-10 p-8 bg-white rounded-2xl shadow-2xl border border-[#254D70]/10">
            <h2 className="d_MP-title text-3xl font-extrabold mb-8 text-center tracking-wide">Add New Offers</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="mb-6">
                    <h3 className="d_MP-section-title text-xl font-bold mb-4">Basic Info</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <div>
                            <label className="d_MP-label block mb-2 font-semibold">Sub Category</label>
                            <div
                                className={`d_MP-custom-dropdown${subCategoryOpen ? ' open' : ''}`}
                                tabIndex={0}
                                ref={subCategoryRef}
                                onClick={() => setSubCategoryOpen((open) => !open)}
                                onKeyDown={handleSubCategoryKeyDown}
                                aria-haspopup="listbox"
                                aria-expanded={subCategoryOpen}
                                role="button"
                            >
                                <div className="d_MP-dropdown-selected">
                                    {form.subCategory || 'Select sub category'}
                                    <span className="d_MP-dropdown-arrow">▼</span>
                                </div>
                                {subCategoryOpen && (
                                    <ul className="d_MP-dropdown-list" role="listbox">
                                        {subcategoryOptions.map((option) => (
                                            <li
                                                key={option}
                                                className={`d_MP-dropdown-option${form.subCategory === option ? ' selected' : ''}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setForm({ ...form, subCategory: option });
                                                    setSubCategoryOpen(false);
                                                }}
                                                role="option"
                                                aria-selected={form.subCategory === option}
                                                tabIndex={-1}
                                            >
                                                {option}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>    </div>
                <div className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="d_MP-label block mb-2 font-semibold">Product Name</label>
                            <input
                                type="text"
                                name="productname"
                                value={form.productname}
                                onChange={handleChange}
                                className="d_MP-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#254D70]"
                                required
                                placeholder="Enter Product Name"
                            />
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="d_MP-section-title text-xl font-bold mb-4">Offers Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="d_MP-label block mb-2 font-semibold">Offers Name</label>
                            <input
                                type="text"
                                name="offersName"
                                value={form.offersName}
                                onChange={handleChange}
                                className="d_MP-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#254D70]"
                                required
                                placeholder="Enter Offers Name"
                            />
                        </div>
                        <div>
                            <label className="d_MP-label block mb-2 font-semibold">Price (₹)</label>
                            <input
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                className="d_MP-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#254D70]"
                                required
                                placeholder="Enter price"
                            />
                        </div>
                    </div>
                </div>
                <div className="mb-6">
                    {/* <h3 className="d_MP-section-title text-xl font-bold mb-4">Coupon Information</h3> */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="d_MP-label block mb-2 font-semibold">Code</label>
                            <input
                                type="text"
                                name="code"
                                value={form.code}
                                onChange={handleChange}
                                className="d_MP-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#254D70]"
                                required
                                placeholder="Enter Category Name"
                            />
                        </div>
                        <div>
                            <label className="d_MP-label block mb-2 font-semibold">Discount</label>
                            <input
                                type="number"
                                name="discount"
                                value={form.discount}
                                onChange={handleChange}
                                className="d_MP-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#254D70]"
                                required
                                placeholder="Enter discount"
                            />
                        </div>
                    </div>
                </div>
                <div className="mb-6">
                    {/* <h3 className="d_MP-section-title text-xl font-bold mb-4">Coupon Information</h3> */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="d_MP-label block mb-2 font-semibold">Start Date</label>
                            <input
                                type="date"
                                name="startDate"
                                value={form.startDate}
                                onChange={handleChange}
                                className="d_MP-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#254D70]"
                                required
                                placeholder="Enter Category Name"
                            />
                        </div>
                        <div>
                            <label className="d_MP-label block mb-2 font-semibold">End Date</label>
                            <input
                                type="date"
                                name="endDate"
                                value={form.endDate}
                                onChange={handleChange}
                                className="d_MP-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#254D70]"
                                required
                                placeholder="Enter Category Name"
                            />
                        </div>
                    </div>
                </div>
                <div className="mb-6">
                    {/* <h3 className="d_MP-section-title text-xl font-bold mb-4">Coupon Information</h3> */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="d_MP-label block mb-2 font-semibold">Status</label>
                            <div className="flex items-center space-x-3">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="status"
                                        checked={form.status}
                                        onChange={(e) => setForm({ ...form, status: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#254D70] rounded-full peer dark:bg-gray-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#254D70] relative"></div>
                                </label>
                                <span className="text-sm text-gray-700">{form.status ? 'Active' : 'Inactive'}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full flex justify-center'>
                    <button type="submit" className="d_MP-btn w-auto bg-[#254D70] text-white py-3 rounded-lg text-lg font-bold shadow hover:bg-[#1e3a56] transition">Add Offers</button>

                </div>
            </form>
        </div>
    );
}

export default OffersForm;