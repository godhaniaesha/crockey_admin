import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar } from "recharts";
import { FaDollarSign, FaShoppingCart, FaUsers, FaChartLine, FaPlus, FaDownload, FaBoxOpen } from "react-icons/fa";
import "../style/d_style.css";

// Dummy Data
const salesData = [
  { month: "Jan", sales: 4000 },
  { month: "Feb", sales: 3000 },
  { month: "Mar", sales: 5000 },
  { month: "Apr", sales: 4780 },
  { month: "May", sales: 5890 },
  { month: "Jun", sales: 4390 },
  { month: "Jul", sales: 6490 },
  { month: "Aug", sales: 7000 },
  { month: "Sep", sales: 6000 },
  { month: "Oct", sales: 7500 },
  { month: "Nov", sales: 8000 },
  { month: "Dec", sales: 9000 },
];

const orders = [
  { id: 1, product: "iPhone 14", customer: "John Doe", date: "2024-06-01", amount: "$999", status: "Success" },
  { id: 2, product: "MacBook Pro", customer: "Jane Smith", date: "2024-06-02", amount: "$1999", status: "Success" },
  { id: 3, product: "AirPods", customer: "Alice Brown", date: "2024-06-03", amount: "$199", status: "Pending" },
  { id: 4, product: "iPad", customer: "Bob Lee", date: "2024-06-04", amount: "$499", status: "Canceled" },
];

const topProducts = [
  { name: "iPhone 14", sales: 120 },
  { name: "MacBook Pro", sales: 80 },
  { name: "AirPods", sales: 60 },
  { name: "iPad", sales: 40 },
];

const categoryData = [
  { name: "Phones", value: 400 },
  { name: "Laptops", value: 300 },
  { name: "Accessories", value: 200 },
  { name: "Tablets", value: 100 },
];

const COLORS = ["#254D70", "#A5BFCC", "#e6eef5", "#22c55e"];

const activities = [
  { id: 1, text: "Order #1234 placed by John Doe", time: "2 min ago" },
  { id: 2, text: "Product 'iPhone 14' stock updated", time: "10 min ago" },
  { id: 3, text: "New customer 'Alice Brown' registered", time: "30 min ago" },
  { id: 4, text: "Order #1233 canceled by Bob Lee", time: "1 hr ago" },
];

const activeUsers = 187;

const barChartData = [
  { month: "Jan", Target: 8000, Achieved: 7000 },
  { month: "Feb", Target: 8000, Achieved: 6000 },
  { month: "Mar", Target: 8000, Achieved: 7500 },
  { month: "Apr", Target: 8000, Achieved: 7800 },
  { month: "May", Target: 8000, Achieved: 8200 },
  { month: "Jun", Target: 8000, Achieved: 7900 },
];

const NAVY1 = "#254D70"; // dark navy
const NAVY2 = "#A5BFCC"; // blue shade

const Dashboard = () => {
  return (
    <div className="min-h-screen d_DS-bg flex flex-col items-center py-8">
      <div className="w-full max-w-7xl px-2 sm:px-4 d_DS-fadein">
        {/* Main Content Area */}
        <div className="d_DS-mainarea bg-white/80 rounded-2xl shadow-lg px-2 sm:px-6 py-8 mb-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-white d_DS-card d_DS-border rounded-2xl shadow p-6 flex flex-col items-center text-center">
              <span className="d_DS-icon mb-2"><FaDollarSign className="text-2xl text-[#254D70]" /></span>
              <span className="text-gray-500 text-sm">Total Sales</span>
              <span className="text-3xl font-bold text-[#254D70]">$85,000</span>
              <span className="text-xs text-green-600 mt-1">▲ 12% this year</span>
            </div>
            <div className="bg-white d_DS-card d_DS-border rounded-2xl shadow p-6 flex flex-col items-center text-center">
              <span className="d_DS-icon mb-2"><FaShoppingCart className="text-2xl text-[#254D70]" /></span>
              <span className="text-gray-500 text-sm">Orders</span>
              <span className="text-3xl font-bold text-[#254D70]">1,250</span>
              <span className="text-xs text-gray-400 mt-1">Monthly Orders</span>
            </div>
            <div className="bg-white d_DS-card d_DS-border rounded-2xl shadow p-6 flex flex-col items-center text-center">
              <span className="d_DS-icon mb-2"><FaChartLine className="text-2xl text-[#254D70]" /></span>
              <span className="text-gray-500 text-sm">Revenue</span>
              <span className="text-3xl font-bold text-[#254D70]">$120,000</span>
              <span className="text-xs text-gray-400 mt-1">This Year</span>
            </div>
            <div className="bg-white d_DS-card d_DS-border rounded-2xl shadow p-6 flex flex-col items-center text-center">
              <span className="d_DS-icon mb-2"><FaUsers className="text-2xl text-[#254D70]" /></span>
              <span className="text-gray-500 text-sm">Customers</span>
              <span className="text-3xl font-bold text-[#254D70]">3,200</span>
              <span className="text-xs text-gray-400 mt-1">Active</span>
            </div>
          </div>
        
          {/* Recent Activities & Sales Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            {/* Recent Activities */}
            <div className="bg-white d_DS-card d_DS-border rounded-2xl shadow p-5 lg:col-span-1 flex flex-col justify-between">
              <div>
                <div className="font-bold text-[#254D70] mb-3">Recent Activities</div>
                <ul className="divide-y divide-[#e6eef5]">
                  {activities.map((act) => (
                    <li key={act.id} className="py-2 flex justify-between items-center text-sm d_DS-activity-item">
                      <span>{act.text}</span>
                      <span className="text-xs text-gray-400 ml-2">{act.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* Sales Chart */}
            <div className="bg-white d_DS-card d_DS-border rounded-2xl shadow p-5 lg:col-span-2 flex flex-col justify-between">
              <h2 className="font-bold text-xl text-[#254D70] mb-4">Sales Overview</h2>
              <div className="w-full h-60 sm:h-64 lg:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="sales" stroke="#254D70" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

            {/* Engaging Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Top Selling Products */}
            <div className="bg-white d_DS-card d_DS-border rounded-2xl shadow p-6 flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-4">
                <FaBoxOpen className="text-[#254D70] text-xl" />
                <span className="font-bold text-[#254D70] text-lg">Top Selling Products</span>
              </div>
              <ul className="text-sm flex flex-col gap-2">
                {topProducts.map((prod, idx) => (
                  <li key={prod.name} className="flex justify-between items-center py-1 px-2 d_DS-topprod-item">
                    <span className="font-medium text-[#254D70] flex items-center gap-2">{idx + 1}. {prod.name}</span>
                    <span className="text-[#A5BFCC] font-bold text-base">{prod.sales}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Sales Target Progress Card (Bar Chart) */}
            <div className="bg-white d_DS-card d_DS-border rounded-2xl shadow p-6 flex flex-col items-center justify-center text-center">
              <span className="font-bold text-[#254D70] mb-4 text-lg">Monthly Sales Target vs. Achieved</span>
              <div className="w-full h-64 d_DS-bar-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 13, fill: '#254D70' }} />
                    <YAxis tick={{ fontSize: 13, fill: '#254D70' }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 14 }} />
                    <Bar dataKey="Target" fill={NAVY1} radius={[6, 6, 0, 0]} barSize={32} />
                    <Bar dataKey="Achieved" fill={NAVY2} radius={[6, 6, 0, 0]} barSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <span className="d_DS-progress-label mt-3 text-[#254D70]">Most months are close to target!</span>
            </div>
          </div>
          {/* Recent Orders Table */}
          <div className="bg-white d_DS-card d_DS-border rounded-2xl shadow p-5 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-xl text-[#254D70]">Recent Orders</h2>
              <button className="text-sm text-[#254D70] underline">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-500 text-xs">
                    <th className="py-2">Product</th>
                    <th className="py-2">Customer</th>
                    <th className="py-2">Date</th>
                    <th className="py-2">Amount</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b last:border-0 d_DS-table-row hover:bg-[#e6eef5]/60 transition">
                      <td className="py-2 font-semibold text-[#254D70]">{order.product}</td>
                      <td className="py-2">{order.customer}</td>
                      <td className="py-2">{order.date}</td>
                      <td className="py-2">{order.amount}</td>
                      <td className="py-2">
                        <span className={`d_DS-status-pill ${
                          order.status === "Success"
                            ? "d_DS-status-success"
                            : order.status === "Pending"
                            ? "d_DS-status-pending"
                            : "d_DS-status-canceled"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="w-full text-center py-4 d_DS-footer text-xs text-[#254D70] opacity-70 mt-auto">
        &copy; {new Date().getFullYear()} Sales Dashboard. All rights reserved.
      </footer>
    </div>
  );
};

export default Dashboard;