import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar, AreaChart, Area } from "recharts";
import { FaDollarSign, FaShoppingCart, FaUsers, FaChartLine, FaPlus, FaDownload, FaBoxOpen, FaStar, FaArrowUp, FaBell, FaCog, FaSearch } from "react-icons/fa";
import { MdDashboard, MdAnalytics, MdInventory, MdPeople, MdSettings } from "react-icons/md";
import "../style/d_style.css";

// Enhanced Dummy Data
const salesData = [
  { month: "Jan", sales: 4000, target: 3500 },
  { month: "Feb", sales: 3000, target: 3500 },
  { month: "Mar", sales: 5000, target: 4000 },
  { month: "Apr", sales: 4780, target: 4500 },
  { month: "May", sales: 5890, target: 5000 },
  { month: "Jun", sales: 4390, target: 4800 },
  { month: "Jul", sales: 6490, target: 5500 },
  { month: "Aug", sales: 7000, target: 6000 },
  { month: "Sep", sales: 6000, target: 6500 },
  { month: "Oct", sales: 7500, target: 7000 },
  { month: "Nov", sales: 8000, target: 7500 },
  { month: "Dec", sales: 9000, target: 8000 },
];

const orders = [
  { id: 1, product: "iPhone 14 Pro", customer: "John Doe", date: "2024-06-01", amount: "$999", status: "Success", priority: "High" },
  { id: 2, product: "MacBook Pro M2", customer: "Jane Smith", date: "2024-06-02", amount: "$1999", status: "Success", priority: "Medium" },
  { id: 3, product: "AirPods Pro", customer: "Alice Brown", date: "2024-06-03", amount: "$199", status: "Pending", priority: "Low" },
  { id: 4, product: "iPad Air", customer: "Bob Lee", date: "2024-06-04", amount: "$499", status: "Canceled", priority: "Medium" },
  { id: 5, product: "Apple Watch", customer: "Sarah Wilson", date: "2024-06-05", amount: "$399", status: "Success", priority: "High" },
];

const topProducts = [
  { name: "iPhone 14 Pro", sales: 120, growth: "+15%", rating: 4.8 },
  { name: "MacBook Pro M2", sales: 80, growth: "+8%", rating: 4.9 },
  { name: "AirPods Pro", sales: 60, growth: "+12%", rating: 4.7 },
  { name: "iPad Air", sales: 40, growth: "+5%", rating: 4.6 },
  { name: "Apple Watch", sales: 35, growth: "+20%", rating: 4.5 },
];

const categoryData = [
  { name: "Phones", value: 400, color: "#1E3E62" },
  { name: "Laptops", value: 300, color: "#577B8D" },
  { name: "Accessories", value: 200, color: "#9DB2BF" },
  { name: "Tablets", value: 100, color: "#D8D8D8" },
];

const activities = [
  { id: 1, text: "Order #1234 placed by John Doe", time: "2 min ago", type: "order" },
  { id: 2, text: "Product 'iPhone 14' stock updated", time: "10 min ago", type: "inventory" },
  { id: 3, text: "New customer 'Alice Brown' registered", time: "30 min ago", type: "customer" },
  { id: 4, text: "Order #1233 canceled by Bob Lee", time: "1 hr ago", type: "cancel" },
  { id: 5, text: "Monthly sales target achieved", time: "2 hr ago", type: "success" },
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

const NAVY1 = "#254D70";
const NAVY2 = "#A5BFCC";

const Dashboard = () => {
  // Responsive chart height
  const [chartHeight, setChartHeight] = React.useState(window.innerWidth <= 640 ? 250 : 280);
  React.useEffect(() => {
    const handleResize = () => {
      setChartHeight(window.innerWidth <= 640 ? 250 : 280);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen d_DS-bg flex flex-col">


      <div className="flex-1 flex">

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="d_DS-fadein">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="d_DS-stat-card d_DS-stat-primary">
                <div className="d_DS-stat-icon">
                  <FaDollarSign className="text-2xl" />
                </div>
                <div className="d_DS-stat-content">
                  <h3 className="d_DS-stat-label">Total Sales</h3>
                  <p className="d_DS-stat-value">$85,000</p>
                  <span className="d_DS-stat-growth d_DS-stat-positive">▲ 12% this year</span>
                </div>
              </div>

              <div className="d_DS-stat-card d_DS-stat-secondary">
                <div className="d_DS-stat-icon">
                  <FaShoppingCart className="text-2xl" />
                </div>
                <div className="d_DS-stat-content">
                  <h3 className="d_DS-stat-label">Orders</h3>
                  <p className="d_DS-stat-value">1,250</p>
                  <span className="d_DS-stat-growth d_DS-stat-neutral">Monthly Orders</span>
                </div>
              </div>

              <div className="d_DS-stat-card d_DS-stat-success">
                <div className="d_DS-stat-icon">
                  <FaChartLine className="text-2xl" />
                </div>
                <div className="d_DS-stat-content">
                  <h3 className="d_DS-stat-label">Revenue</h3>
                  <p className="d_DS-stat-value">$120,000</p>
                  <span className="d_DS-stat-growth d_DS-stat-positive">▲ 8% this year</span>
                </div>
              </div>

              <div className="d_DS-stat-card d_DS-stat-info">
                <div className="d_DS-stat-icon">
                  <FaUsers className="text-2xl" />
                </div>
                <div className="d_DS-stat-content">
                  <h3 className="d_DS-stat-label">Customers</h3>
                  <p className="d_DS-stat-value">3,200</p>
                  <span className="d_DS-stat-growth d_DS-stat-positive">▲ 5% this month</span>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Sales Chart */}
              <div className="d_DS-chart-card lg:col-span-2">
                <div className="d_DS-chart-header">
                  <h2 className="d_DS-chart-title">Sales Overview</h2>
                  <div className="d_DS-chart-actions">
                    <button className="d_DS-chart-btn">Export</button>
                    <button className="d_DS-chart-btn">Details</button>
                  </div>
                </div>
                <div className="d_DS-chart-container">
                  <ResponsiveContainer width="100%" height={chartHeight} className="absolute md:left-[-4%] sm:left-[-6%] left-[-9%]">
                    <AreaChart
                      data={salesData}
                      margin={{ top: 20, right: 24, left: 24, bottom: 8 }}
                    >
                      <defs>
                        <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#254D70" stopOpacity={0.18} />
                          <stop offset="95%" stopColor="#254D70" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e6eef5" />
                      <XAxis
                        dataKey="month"
                        stroke="#254D70"
                        tick={{ fontSize: 13, fill: '#254D70', fontWeight: 500 }}
                        axisLine={{ stroke: '#e6eef5' }}
                        tickLine={false}
                      />
                      <YAxis
                        stroke="#254D70"
                        tick={{ fontSize: 13, fill: '#254D70', fontWeight: 500 }}
                        axisLine={{ stroke: '#e6eef5' }}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #254D70',
                          borderRadius: '10px',
                          boxShadow: '0 4px 16px rgba(37,77,112,0.10)',
                          color: '#254D70',
                          fontWeight: 600,
                          fontSize: 14,
                          padding: 12,
                        }}
                        labelStyle={{ color: '#254D70', fontWeight: 700 }}
                        itemStyle={{ color: '#254D70', fontWeight: 500 }}
                      />
                      <Area
                        type="monotone"
                        dataKey="sales"
                        stroke="#254D70"
                        strokeWidth={3.5}
                        fill="url(#salesGradient)"
                        dot={{ r: 5, fill: '#fff', stroke: '#254D70', strokeWidth: 2 }}
                        activeDot={{ r: 7, fill: '#254D70', stroke: '#fff', strokeWidth: 2 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Distribution */}
              <div className="d_DS-chart-card">
                <div className="d_DS-chart-header">
                  <h2 className="d_DS-chart-title">Category Distribution</h2>
                </div>
                <div className="d_DS-chart-container d_DS-pie-chart">
                  <ResponsiveContainer width="100%" height={280} className="absolute md:top-[-10%] top-[-14%]">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={90}
                        paddingAngle={8}
                        dataKey="value"
                        stroke="#fff"
                        strokeWidth={2}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e6eef5',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                        formatter={(value, name) => [`${value} units`, name]}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        wrapperStyle={{
                          paddingTop: '20px',
                          fontSize: '12px',
                          color: '#64748b'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Products and Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Top Products */}
              <div className="d_DS-chart-card">
                <div className="d_DS-chart-header">
                  <h2 className="d_DS-chart-title">Top Products</h2>
                  <FaStar className="text-[#254D70]" />
                </div>
                <div className="d_DS-products-list">
                  {topProducts.map((prod, idx) => (
                    <div key={prod.name} className="d_DS-product-item">
                      <div className="d_DS-product-rank">{idx + 1}</div>
                      <div className="d_DS-product-info">
                        <h4 className="d_DS-product-name">{prod.name}</h4>
                        <div className="d_DS-product-meta">
                          <span className="d_DS-product-sales">{prod.sales} sales</span>
                          <span className="d_DS-product-growth">{prod.growth}</span>
                        </div>
                      </div>
                      <div className="d_DS-product-rating">
                        <FaStar className="text-yellow-400" />
                        <span>{prod.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activities */}
              <div className="d_DS-chart-card">
                <div className="d_DS-chart-header">
                  <h2 className="d_DS-chart-title">Recent Activities</h2>
                  <FaBell className="text-[#254D70]" />
                </div>
                <div className="d_DS-activities-list">
                  {activities.map((act) => (
                    <div key={act.id} className="d_DS-activity-item">
                      <div className="d_DS-activity-icon">
                        {act.type === 'order' && <FaShoppingCart />}
                        {act.type === 'inventory' && <FaBoxOpen />}
                        {act.type === 'customer' && <FaUsers />}
                        {act.type === 'cancel' && <FaArrowUp />}
                        {act.type === 'success' && <FaChartLine />}
                      </div>
                      <div className="d_DS-activity-content">
                        <p className="d_DS-activity-text">{act.text}</p>
                        <span className="d_DS-activity-time">{act.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sales Target */}
              <div className="d_DS-chart-card">
                <div className="d_DS-chart-header">
                  <h2 className="d_DS-chart-title">Sales Target</h2>
                  <FaArrowUp className="text-[#254D70]" />
                </div>
                <div className="d_DS-target-container">
                  <div className="d_DS-target-chart">
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={barChartData} margin={{ top: 10, right: 0, left: 0, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e6eef5" />
                        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} />
                        <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                        <Tooltip />
                        <Bar dataKey="Target" fill="#e6eef5" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Achieved" fill="#254D70" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="d_DS-target-stats">
                    <div className="d_DS-target-stat">
                      <span className="d_DS-target-label">Target</span>
                      <span className="d_DS-target-value">$48,000</span>
                    </div>
                    <div className="d_DS-target-stat">
                      <span className="d_DS-target-label">Achieved</span>
                      <span className="d_DS-target-value">$44,600</span>
                    </div>
                    <div className="d_DS-target-stat">
                      <span className="d_DS-target-label">Progress</span>
                      <span className="d_DS-target-value d_DS-target-progress">92.9%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders Table */}
            <div className="d_DS-table-card">
              <div className="d_DS-table-header">
                <h2 className="d_DS-table-title">Recent Orders</h2>
                <button className="d_DS-table-btn">View All Orders</button>
              </div>
              <div className="d_DS-table-container">
                <table className="d_DS-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Priority</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="d_DS-table-row">
                        <td className="d_DS-table-cell">
                          <div className="d_DS-product-cell">
                            <span className="d_DS-product-name">{order.product}</span>
                          </div>
                        </td>
                        <td className="d_DS-table-cell">{order.customer}</td>
                        <td className="d_DS-table-cell">{order.date}</td>
                        <td className="d_DS-table-cell d_DS-amount">{order.amount}</td>
                        <td className="d_DS-table-cell">
                          <span className={`d_DS-priority d_DS-priority-${order.priority.toLowerCase()}`}>
                            {order.priority}
                          </span>
                        </td>
                        <td className="d_DS-table-cell">
                          <span className={`d_DS-status d_DS-status-${order.status.toLowerCase()}`}>
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
        </main>
      </div>
    </div>
  );
};

export default Dashboard;