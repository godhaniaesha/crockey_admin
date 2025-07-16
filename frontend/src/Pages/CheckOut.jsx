import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserById } from "../redux/slice/auth.slice";
import { placeOrder } from "../redux/slice/order.slice";


const CheckOut = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        mobileNo: '',
        email: '',
        country: '',
        address: '',
        city: '',
        state: '',
        pinCode: ''
    });

    const checkOutData = location.state;

    useEffect(() => {
        if (!location.state) {
            navigate('/cart'); // or any page you want to send them to
        }
    }, [location, navigate]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No authentication token found');
                    return;
                }
                const decoded = jwtDecode(token);

                await dispatch(getUserById({ userId: decoded._id })).unwrap();

            } catch (error) {
                console.error('Data fetching error:', error);
            }
        };
        fetchUserData();
    }, [dispatch]);

    // Update form with user data when user data is available
    useEffect(() => {
        if (user) {
            console.log("user", user);

            setForm(prevForm => ({
                ...prevForm,
                email: user.email || '',
                mobileNo: user.phone_number || '',
                firstName: user.username ? user.username.split(' ')[0] : '',
                lastName: user.username ? user.username.split(' ').slice(1).join(' ') : '',
            }));
        }
    }, [user]);

    const [selectedShipping, setSelectedShipping] = useState('option1');
    const [selectedPayment, setSelectedPayment] = useState('paypal');

    // Extract order items from checkout data
    const getOrderItems = () => {
        if (!checkOutData || !checkOutData.cartItems) return [];

        const items = [];
        checkOutData.cartItems.forEach(cartItem => {
            cartItem.products.forEach(product => {
                items.push({
                    id: product._id,
                    name: product.product_id.name || 'Product Name',
                    quantity: product.quantity,
                    price: product.product_id.price || 0,
                    image: product.product_id.image || ''
                });
            });
        });
        return items;
    };

    const orderItems = getOrderItems();

    // Calculate totals from checkout data
    const subtotal = checkOutData ? checkOutData.subtotal : 0;
    const discount = checkOutData ? checkOutData.discount : 0;
    const shippingCost = selectedShipping === 'option1' ? 240.00 : 260.00;
    const total = subtotal - discount + shippingCost;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user?._id) {
            alert("User not logged in!");
            return;
        }

        const shippingAddress = `${form.address}, ${form.city}, ${form.state}, ${form.pinCode}, ${form.country}`;

        const payload = {
            user_id: user._id,
            paymentType: selectedPayment,
            shippingAddress
        };

        try {
            await dispatch(placeOrder(payload)).unwrap();
            alert('Order Placed Successfully!');

            // Reset form
            setForm({
                firstName: '',
                lastName: '',
                mobileNo: '',
                email: '',
                country: '',
                address: '',
                city: '',
                state: '',
                pinCode: ''
            });

            // Clear cart (if you have such an action)
            // dispatch(clearCart()); // This line is removed as per the edit hint.

            // Redirect (optional)
            navigate('/orders/placed');
        } catch (error) {
            console.error("Order failed:", error);
            alert('Order placement failed.');
        }
    };

    // if (loading) {
    //     return <div className="flex justify-center items-center h-64">Loading...</div>;
    // }



    return (
        <>
            <div className="d_MP-container w-full mt-10 p-8 bg-white rounded-2xl shadow-2xl border border-[#254D70]/10">
                <h2 className="d_MP-title text-3xl font-extrabold mb-8 tracking-wide">Billing Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="mb-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="d_MP-label block mb-2 font-semibold">First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={form.firstName}
                                            onChange={handleChange}
                                            className="d_MP-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#254D70]"
                                            required
                                            placeholder="Enter First Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="d_MP-label block mb-2 font-semibold">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={form.lastName}
                                            onChange={handleChange}
                                            className="d_MP-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#254D70]"
                                            required
                                            placeholder="Enter Last Name"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mb-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="d_MP-label block mb-2 font-semibold">Mobile No.</label>
                                        <input
                                            type="text"
                                            name="mobileNo"
                                            value={form.mobileNo}
                                            onChange={handleChange}
                                            className="d_MP-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#254D70]"
                                            required
                                            placeholder="Enter Mobile Number"
                                        />
                                    </div>
                                    <div>
                                        <label className="d_MP-label block mb-2 font-semibold">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            className="d_MP-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#254D70]"
                                            required
                                            placeholder="Enter Email Address"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mb-6">
                                <div className="grid grid-cols-1 gap-6">
                                    <div>
                                        <label className="d_MP-label block mb-2 font-semibold">Address</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={form.address}
                                            onChange={handleChange}
                                            className="d_MP-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#254D70]"
                                            required
                                            placeholder="Enter address"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mb-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="d_MP-label block mb-2 font-semibold">Town/City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={form.city}
                                            onChange={handleChange}
                                            className="d_MP-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#254D70]"
                                            required
                                            placeholder="Enter City"
                                        />
                                    </div>
                                    <div>
                                        <label className="d_MP-label block mb-2 font-semibold">State</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={form.state}
                                            onChange={handleChange}
                                            className="d_MP-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#254D70]"
                                            required
                                            placeholder="Enter State"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mb-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="d_MP-label block mb-2 font-semibold">Country</label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={form.country}
                                            onChange={handleChange}
                                            className="d_MP-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#254D70]"
                                            required
                                            placeholder="Enter Country"
                                        />
                                    </div>
                                    <div>
                                        <label className="d_MP-label block mb-2 font-semibold">Postal Code</label>
                                        <input
                                            type="text"
                                            name="pinCode"
                                            value={form.pinCode}
                                            onChange={handleChange}
                                            className="d_MP-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#254D70]"
                                            required
                                            placeholder="Enter PinCode"
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="border border-[#a6c2db] rounded-md p-6 h-fit">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-700">Product</h3>
                            <h3 className="text-lg font-semibold text-gray-700">Total</h3>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-3 mb-4">
                            {orderItems.length > 0 ? (
                                orderItems.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center text-gray-600">
                                        <span className="text-sm">{item.name} × {item.quantity}</span>
                                        <span className="font-medium">${item.price.toFixed(2)}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-500">No items in cart</div>
                            )}
                        </div>

                        {/* Subtotal */}
                        <div className="flex justify-between items-center py-3 border-t border-gray-200">
                            <span className="font-semibold text-gray-700">Subtotal</span>
                            <span className="font-semibold">${subtotal.toFixed(2)}</span>
                        </div>

                        {/* Discount */}
                        {discount > 0 && (
                            <div className="flex justify-between items-center py-3 border-t border-gray-200">
                                <span className="font-semibold text-gray-700">Discount</span>
                                <span className="font-semibold text-green-600">-${discount.toFixed(2)}</span>
                            </div>
                        )}

                        {/* Shipping Options */}
                        <div className="py-3 border-t border-gray-200">
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-semibold text-gray-700">Shipping</span>
                                <div className="text-right">
                                    <div className="space-y-2">
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="shipping"
                                                value="option1"
                                                checked={selectedShipping === 'option1'}
                                                onChange={(e) => setSelectedShipping(e.target.value)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-5 h-5 rounded border border-gray-400 bg-white peer-checked:border-[#254D70] flex items-center justify-center transition-colors duration-200">
                                                {selectedShipping === 'option1' && (
                                                    <FaCheck className="w-3 h-3 text-[#254D70]" />
                                                )}
                                            </div>
                                            <span className="text-sm text-gray-700">Standard ($240.00)</span>
                                        </label>
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="shipping"
                                                value="option2"
                                                checked={selectedShipping === 'option2'}
                                                onChange={(e) => setSelectedShipping(e.target.value)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-5 h-5 rounded border border-gray-400 bg-white peer-checked:border-[#254D70] flex items-center justify-center transition-colors duration-200">
                                                {selectedShipping === 'option2' && (
                                                    <FaCheck className="w-3 h-3 text-[#254D70]" />
                                                )}
                                            </div>
                                            <span className="text-sm text-gray-700">Express ($260.00)</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Total */}
                        <div className="flex justify-between items-center py-3 border-t border-gray-200 mb-6">
                            <span className="font-bold text-lg text-gray-800">Total</span>
                            <span className="font-bold text-lg text-gray-800">${total.toFixed(2)}</span>
                        </div>

                        {/* Payment Methods */}
                        <div className="mb-6">
                            <div className="space-y-3">
                                <label className="flex items-center cursor-pointer p-2 rounded hover:bg-gray-50 space-x-3">
                                    <span className="relative">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="check"
                                            checked={selectedPayment === 'check'}
                                            onChange={(e) => setSelectedPayment(e.target.value)}
                                            className="sr-only"
                                        />
                                        <span
                                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedPayment === 'check' ? 'border-[#254D70]' : 'border-blue-100'
                                                }`}
                                        >
                                            {selectedPayment === 'check' && (
                                                <span className="w-2 h-2 bg-[#254D70] rounded-full" />
                                            )}
                                        </span>
                                    </span>
                                    <span className="text-sm font-medium">Check Payments</span>
                                </label>
                                <label className="flex items-center cursor-pointer p-2 rounded hover:bg-gray-50 space-x-3">
                                    <span className="relative">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="cod"
                                            checked={selectedPayment === 'cod'}
                                            onChange={(e) => setSelectedPayment(e.target.value)}
                                            className="sr-only"
                                        />
                                        <span
                                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedPayment === 'cod' ? 'border-[#254D70]' : 'border-blue-100'
                                                }`}
                                        >
                                            {selectedPayment === 'cod' && (
                                                <span className="w-2 h-2 bg-[#254D70] rounded-full" />
                                            )}
                                        </span>
                                    </span>
                                    <span className="text-sm font-medium">Cash On Delivery</span>
                                </label>
                                <label className="flex items-center cursor-pointer p-2 rounded hover:bg-gray-50 space-x-3">
                                    <span className="relative">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="paypal"
                                            checked={selectedPayment === 'paypal'}
                                            onChange={(e) => setSelectedPayment(e.target.value)}
                                            className="sr-only"
                                        />
                                        <span
                                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedPayment === 'paypal' ? 'border-[#254D70]' : 'border-blue-100'
                                                }`}
                                        >
                                            {selectedPayment === 'paypal' && (
                                                <span className="w-2 h-2 bg-[#254D70] rounded-full" />
                                            )}
                                        </span>
                                    </span>
                                    <div className="flex items-center space-x-2">
                                        <div className="flex space-x-1">
                                            <div className="border p-1">
                                                <img src={require('../Image/download.png')} alt="" className="w-10 h-8" />
                                            </div>
                                            <div className="border p-1">
                                                <img src={require('../Image/visa.png')} alt="" className="w-10 h-8" />
                                            </div>
                                            <div className="border p-1">
                                                <img src={require('../Image/master.png')} alt="" className="w-10 h-8" />
                                            </div>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Place Order Button */}
                        <button
                            onClick={handleSubmit}
                            className="w-full d_MP-btn"
                            disabled={orderItems.length === 0}
                        >
                            Place Order
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CheckOut;