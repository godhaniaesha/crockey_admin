import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCoupon, fetchCoupons } from "../redux/slice/coupon.slice";
import { IoClose } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "./Spinner";

const CouponEditForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { coupons = [], loading = false, error } = useSelector(state => state.coupon);
    
    const [form, setForm] = useState({ 
        code: '', 
        discount: '', 
        description: '', 
        active: true, 
        expiresAt: '' 
    });
    const [toast, setToast] = useState({ show: false, message: '', type: 'error' });
    const [isLoading, setIsLoading] = useState(true);

    // Find the coupon to edit
    const couponToEdit = coupons.find(coupon => coupon._id === id);

    useEffect(() => {
        const loadCouponsAndSetForm = async () => {
            try {
                // If coupons are not loaded, fetch them
                if (coupons.length === 0) {
                    await dispatch(fetchCoupons());
                }
                
                // Set form data if coupon is found
                if (couponToEdit) {
                    setForm({
                        code: couponToEdit.code || '',
                        discount: couponToEdit.discount?.toString() || '',
                        description: couponToEdit.description || '',
                        active: couponToEdit.active || false,
                        expiresAt: couponToEdit.expiresAt ? new Date(couponToEdit.expiresAt).toISOString().slice(0, 16) : ''
                    });
                } else {
                    setToast({
                        show: true,
                        message: 'Coupon not found',
                        type: 'error'
                    });
                }
            } catch (error) {
                setToast({
                    show: true,
                    message: 'Error loading coupon data',
                    type: 'error'
                });
            } finally {
                setIsLoading(false);
            }
        };

        loadCouponsAndSetForm();
    }, [dispatch, id, couponToEdit, coupons.length]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ 
            ...form, 
            [name]: type === 'checkbox' ? checked : value 
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Validate form data
            if (!form.code || !form.discount) {
                setToast({
                    show: true,
                    message: 'Please fill in all required fields',
                    type: 'error'
                });
                return;
            }

            // Prepare coupon data according to the model
            const couponData = {
                code: form.code,
                discount: parseInt(form.discount),
                description: form.description,
                active: form.active,
                expiresAt: form.expiresAt || null
            };

            const result = await dispatch(updateCoupon({ id, couponData }));
            
            if (updateCoupon.fulfilled.match(result)) {
                setToast({
                    show: true,
                    message: 'Coupon updated successfully!',
                    type: 'success'
                });
                
                // Navigate to coupon list after 2 seconds
                setTimeout(() => {
                    navigate('/coupons/list');
                }, 2000);
            } else if (updateCoupon.rejected.match(result)) {
                setToast({
                    show: true,
                    message: result.payload || 'Failed to update coupon',
                    type: 'error'
                });
            }
        } catch (error) {
            setToast({
                show: true,
                message: 'Error updating coupon: ' + (error.message || 'Unknown error'),
                type: 'error'
            });
        }
    };

    const closeToast = () => {
        setToast({ show: false, message: '', type: 'error' });
    };

    // Simple Toast Component
    const Toast = ({ message, type, onClose }) => {
        const bgColor = type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6';
        
        return (
            <div style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                background: bgColor,
                color: 'white',
                padding: '12px 20px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 9999,
                maxWidth: '300px',
                wordWrap: 'break-word'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>{message}</span>
                    <button 
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            marginLeft: '10px',
                            fontSize: '18px'
                        }}
                    >
                        ×
                    </button>
                </div>
            </div>
        );
    };

    if (isLoading) {
        return <Spinner />;
    }

    if (!couponToEdit) {
        return (
            <div className="d_MP-container w-full mt-10 p-8 bg-white rounded-2xl shadow-2xl border border-[#254D70]/10">
                <div className="text-center text-red-600">Coupon not found</div>
            </div>
        );
    }

    return (
        <div className="d_MP-container w-full mt-10 p-8 bg-white rounded-2xl shadow-2xl border border-[#254D70]/10">
            {toast.show && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={closeToast} 
                />
            )}
            
            <h2 className="d_MP-title text-3xl font-extrabold mb-8 text-center tracking-wide">Edit Coupon</h2>
            <form onSubmit={handleSubmit} className="space-y-8">

                <div className="mb-6">
                    <h3 className="d_MP-section-title text-xl font-bold mb-4">Coupon Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="d_MP-label block mb-2 font-semibold">Coupon Code *</label>
                            <input
                                type="text"
                                name="code"
                                value={form.code}
                                onChange={handleChange}
                                className="d_MP-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#254D70]"
                                required
                                placeholder="Enter Coupon Code (e.g., SUMMER20)"
                            />
                        </div>
                        <div>
                            <label className="d_MP-label block mb-2 font-semibold">Discount (%) *</label>
                            <input
                                type="number"
                                name="discount"
                                value={form.discount}
                                onChange={handleChange}
                                className="d_MP-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#254D70]"
                                required
                                min="1"
                                max="100"
                                placeholder="Enter discount percentage"
                            />
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="d_MP-label block mb-2 font-semibold">Description</label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                className="d_MP-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#254D70]"
                                rows="3"
                                placeholder="Enter coupon description"
                            />
                        </div>
                        <div>
                            <label className="d_MP-label block mb-2 font-semibold">Expires At</label>
                            <input
                                type="datetime-local"
                                name="expiresAt"
                                value={form.expiresAt}
                                onChange={handleChange}
                                className="d_MP-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#254D70]"
                                placeholder="Select expiration date"
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
                                        name="active"
                                        checked={form.active}
                                        onChange={handleChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#254D70] rounded-full peer dark:bg-gray-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#254D70] relative"></div>
                                </label>
                                <span className="text-sm text-gray-700">{form.active ? 'Active' : 'Inactive'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='w-full flex justify-center gap-4'>
                    <button 
                        type="button"
                        onClick={() => navigate('/coupons/list')}
                        className="d_MP-btn w-auto bg-gray-500 text-white py-3 px-6 rounded-lg text-lg font-bold shadow hover:bg-gray-600 transition"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="d_MP-btn w-auto bg-[#254D70] text-white py-3 px-6 rounded-lg text-lg font-bold shadow hover:bg-[#1e3a56] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Updating Coupon...' : 'Update Coupon'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CouponEditForm; 