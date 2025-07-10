import { useState } from "react";

const CheckOut = () => {

    const [form, setForm] = useState({ firstName: '', lastName: '', mobileNo: '', email: '', country: '', address: '', city: '', state: '', pinCode: '' });

    const [selectedShipping, setSelectedShipping] = useState('option1');
    const [selectedPayment, setSelectedPayment] = useState('paypal');

    // Sample order data
    const orderItems = [
        { id: 1, name: 'Pink Slim Shirt', quantity: 1, price: 25.10 },
        { id: 2, name: 'SLim Fit Jeans', quantity: 1, price: 555.00 }
    ];

    const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = selectedShipping === 'option1' ? 240.00 : 260.00;
    const total = subtotal + shippingCost;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        alert('Order Placed Successfully!');
    };

    const handleShippingChange = (option) => {
        setSelectedShipping(prev => ({
            ...prev,
            [option]: !prev[option]
        }));
    };
    return (
        <>
            <div className="d_MP-container w-full mt-10 p-8 bg-white rounded-2xl shadow-2xl border border-[#254D70]/10">
                <h2 className="d_MP-title text-3xl font-extrabold mb-8 tracking-wide">Billing Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className=" col-span-2 ">
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
                                            placeholder="Enter Coupon Name"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mb-6">
                                <div className="grid grid-cols-1  gap-6">
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
                            <div className='w-full flex justify-center'>
                                <button type="submit" className="d_MP-btn w-auto bg-[#254D70] text-white py-3 rounded-lg text-lg font-bold shadow hover:bg-[#1e3a56] transition">Add Coupon</button>

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
                            {orderItems.map((item) => (
                                <div key={item.id} className="flex justify-between items-center text-gray-600">
                                    <span className="text-sm">{item.name} × {item.quantity}</span>
                                    <span className="font-medium">${item.price.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        {/* Subtotal */}
                        <div className="flex justify-between items-center py-3 border-t border-gray-200">
                            <span className="font-semibold text-gray-700">Subtotal</span>
                            <span className="font-semibold">${subtotal.toFixed(2)}</span>
                        </div>

                        {/* Shipping Options */}
                        <div className="py-3 border-t border-gray-200">
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-semibold text-gray-700">Shipping</span>
                                <div className="text-right">
                                    <div className="space-y-2">
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedShipping.option1}
                                                onChange={() => handleShippingChange('option1')}
                                                className="mr-2 w-4 h-4 text-[#1D3C57] bg-gray-100 border-gray-300 rounded "
                                            />
                                            <span className="text-sm text-gray-600">Option 1</span>
                                        </label>
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedShipping.option2}
                                                onChange={() => handleShippingChange('option2')}
                                                className="mr-2 w-4 h-4 text-[#1D3C57] bg-gray-100 border-gray-300 rounded "
                                            />
                                            <span className="text-sm text-gray-600">Option 2</span>
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
                                <label className="flex items-center cursor-pointer p-2 rounded hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="check"
                                        checked={selectedPayment === 'check'}
                                        onChange={(e) => setSelectedPayment(e.target.value)}
                                        className="mr-3 text-[#254D70]"
                                    />
                                    <span className="text-sm font-medium">Check Payments</span>
                                </label>

                                <label className="flex items-center cursor-pointer p-2 rounded hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="cod"
                                        checked={selectedPayment === 'cod'}
                                        onChange={(e) => setSelectedPayment(e.target.value)}
                                        className="mr-3 text-[#254D70]"
                                    />
                                    <span className="text-sm font-medium">Cash On Delivery</span>
                                </label>

                                <label className="flex items-center cursor-pointer p-2 rounded hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="paypal"
                                        checked={selectedPayment === 'paypal'}
                                        onChange={(e) => setSelectedPayment(e.target.value)}
                                        className="mr-3 text-[#254D70]"
                                    />
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium">PayPal</span>
                                        <div className="flex space-x-1">
                                            <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">PP</div>
                                            <div className="w-8 h-5 bg-red-500 rounded text-white text-xs flex items-center justify-center font-bold">MC</div>
                                            <div className="w-8 h-5 bg-blue-800 rounded text-white text-xs flex items-center justify-center font-bold">V</div>
                                            <div className="w-8 h-5 bg-blue-400 rounded text-white text-xs flex items-center justify-center font-bold">M</div>
                                            <div className="w-8 h-5 bg-blue-300 rounded text-white text-xs flex items-center justify-center font-bold">AE</div>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Place Order Button */}
                        <button
                            onClick={handleSubmit}
                            className="w-full d_MP-btn "
                        >
                            Place Order
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CheckOut;