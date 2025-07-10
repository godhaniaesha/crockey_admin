import { useState } from "react";
import { IoClose } from "react-icons/io5";

const CouponForm = () => {
    const [form, setForm] = useState({ couponName: '', status: false, startDate: '', endDate: '', couponCode: '', price: '', image: '' });
    // const inputRef = useRef(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        alert('Coupen Added!');
    };
    
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm({
                ...form,
                image: file,
                imageName: file.name
            });
        }
    };

    const removeFile = () => {
        setForm({
            ...form,
            image: null,
            imageName: ''
        });
    };
    return (
        <div className="d_MP-container w-full mt-10 p-8 bg-white rounded-2xl shadow-2xl border border-[#254D70]/10">
            <h2 className="d_MP-title text-3xl font-extrabold mb-8 text-center tracking-wide">Add New Coupon</h2>
            <form onSubmit={handleSubmit} className="space-y-8">

                <div className="mb-6">
                    <h3 className="d_MP-section-title text-xl font-bold mb-4">Coupon Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="d_MP-label block mb-2 font-semibold">Coupon Name</label>
                            <input
                                type="text"
                                name="couponName"
                                value={form.couponName}
                                onChange={handleChange}
                                className="d_MP-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#254D70]"
                                required
                                placeholder="Enter Coupon Name"
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
                            <label className="d_MP-label block mb-2 font-semibold">Coupon Code</label>
                            <input
                                type="text"
                                name="couponCode"
                                value={form.couponCode}
                                onChange={handleChange}
                                className="d_MP-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#254D70]"
                                required
                                placeholder="Enter Category Name"
                            />
                        </div>
                        <div>
                            <label className="d_MP-label block mb-2 font-semibold">Image</label>
                            {/* <div className="relative"> */}
                            <div className="flex items-center justify-between d_MP-input rounded-lg overflow-hidden px-4 py-2">
                              <span className="text-sm truncate flex items-center gap-2 bg-gray-200 p-1">
                                    {form.imageName || "No file chosen"}
                                    {form.imageName && (
                                        <button
                                            type="button"
                                            onClick={removeFile}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <IoClose size={16} />
                                        </button>
                                    )}
                                </span>
                                <label className="cursor-pointer bg-[#254D70] text-white px-2 py-1 rounded-md text-xs font-semibold hover:bg-[#1e3a56] transition">
                                    Choose File
                                    <input
                                        type="file"
                                        accept="image/*"
                                        name="image"
                                       onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
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
                    <button type="submit" className="d_MP-btn w-auto bg-[#254D70] text-white py-3 rounded-lg text-lg font-bold shadow hover:bg-[#1e3a56] transition">Add Coupon</button>

                </div>
            </form>
        </div>
    );
}

export default CouponForm;