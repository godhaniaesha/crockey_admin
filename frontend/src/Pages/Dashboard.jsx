import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSummary,
  fetchSalesOverview,
  fetchCategoryDistribution,
  fetchTopProducts,
  fetchRecentActivities,
  fetchSalesTarget
} from "../redux/slice/dashboard.slice";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar, AreaChart, Area } from "recharts";
import { FaDollarSign, FaShoppingCart, FaUsers, FaChartLine, FaPlus, FaDownload, FaBoxOpen, FaStar, FaArrowUp, FaBell, FaCog, FaSearch } from "react-icons/fa";
import { MdDashboard, MdAnalytics, MdInventory, MdPeople, MdSettings } from "react-icons/md";
import "../style/d_style.css";
import Spinner from "./Spinner";

const NAVY1 = "#254D70";
const NAVY2 = "#A5BFCC";

const Dashboard = () => {
  const dispatch = useDispatch();
  const {
    summary,
    salesOverview,
    categoryDistribution,
    topProducts,
    recentActivities,
    salesTarget,
    loading,
    error
  } = useSelector((state) => state.dashboard);

  // Responsive chart height
  const [chartHeight, setChartHeight] = React.useState(window.innerWidth <= 640 ? 250 : 280);
  useEffect(() => {
    const handleResize = () => {
      setChartHeight(window.innerWidth <= 640 ? 250 : 280);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch all dashboard data on mount
  useEffect(() => {
    dispatch(fetchSummary());
    dispatch(fetchSalesOverview());
    dispatch(fetchCategoryDistribution());
    dispatch(fetchTopProducts());
    dispatch(fetchRecentActivities());
    dispatch(fetchSalesTarget());
  }, [dispatch]);

  // Loading and error states
  if (loading) {
    return <Spinner />;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-red-600">{error}</div>;
  }

  // Formatters
  const formatCurrency = (value) => {
    if (typeof value !== 'number') return value;
    return `$${value.toLocaleString()}`;
  };

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
                  <p className="d_DS-stat-value">{formatCurrency(summary?.totalSales)}</p>
                  <span className="d_DS-stat-growth d_DS-stat-positive">▲ 12% this year</span>
                </div>
              </div>

              <div className="d_DS-stat-card d_DS-stat-secondary">
                <div className="d_DS-stat-icon">
                  <FaShoppingCart className="text-2xl" />
                </div>
                <div className="d_DS-stat-content">
                  <h3 className="d_DS-stat-label">Orders</h3>
                  <p className="d_DS-stat-value">{summary?.totalOrders ?? '-'}</p>
                  <span className="d_DS-stat-growth d_DS-stat-neutral">Monthly Orders</span>
                </div>
              </div>

              <div className="d_DS-stat-card d_DS-stat-success">
                <div className="d_DS-stat-icon">
                  <FaChartLine className="text-2xl" />
                </div>
                <div className="d_DS-stat-content">
                  <h3 className="d_DS-stat-label">Revenue</h3>
                  <p className="d_DS-stat-value">{formatCurrency(summary?.totalRevenue)}</p>
                  <span className="d_DS-stat-growth d_DS-stat-positive">▲ 8% this year</span>
                </div>
              </div>

              <div className="d_DS-stat-card d_DS-stat-info">
                <div className="d_DS-stat-icon">
                  <FaUsers className="text-2xl" />
                </div>
                <div className="d_DS-stat-content">
                  <h3 className="d_DS-stat-label">Customers</h3>
                  <p className="d_DS-stat-value">{summary?.totalCustomers ?? '-'}</p>
                  <span className="d_DS-stat-growth d_DS-stat-positive">▲ {summary?.newCustomersThisMonth ?? 0} this month</span>
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
                      data={salesOverview}
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
                        tickFormatter={(m) => {
                          // If month is a number, convert to short name
                          if (typeof m === 'number') {
                            return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][m - 1];
                          }
                          return m;
                        }}
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
                        labelFormatter={(m) => {
                          if (typeof m === 'number') {
                            return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][m - 1];
                          }
                          return m;
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="total"
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
                  {categoryDistribution && categoryDistribution.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280} className="absolute md:top-[-10%] top-[-14%]">
                      <PieChart>
                        <Pie
                          data={categoryDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={90}
                          paddingAngle={8}
                          dataKey="count"
                          nameKey="category"
                          stroke="#fff"
                          strokeWidth={2}
                        >
                          {categoryDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={[NAVY1, NAVY2, "#9DB2BF", "#D8D8D8"][index % 4]} />
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
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                      <img
                        src={require('../Image/norecordfound.png')}
                        alt="No records found"
                        style={{ width: 150, margin: "0 auto", display: "block" }}
                      />
                      {/* <div>No records found.</div> */}
                    </div>
                  )}
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
                  {(topProducts && topProducts.length > 0) ? (
                    topProducts.map((prod, idx) => (
                      <div key={prod.name || idx} className="d_DS-product-item">
                        <div className="d_DS-product-rank">{prod.rank || idx + 1}</div>
                        <div className="d_DS-product-info">
                          <h4 className="d_DS-product-name">{prod.name}</h4>
                          <div className="d_DS-product-meta">
                            <span className="d_DS-product-sales">{prod.sales} sales</span>
                            {/* <span className="d_DS-product-growth">{prod.growth}</span> */}
                          </div>
                        </div>
                        {/* <div className="d_DS-product-rating">
                          <FaStar className="text-yellow-400" />
                          <span>{prod.rating}</span>
                        </div> */}
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                      <img
                        src={require('../Image/norecordfound.png')}
                        alt="No records found"
                        style={{ width: 150, margin: "0 auto", display: "block" }}
                      />
                      {/* <div>No records found.</div> */}
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Activities */}
              <div className="d_DS-chart-card">
                <div className="d_DS-chart-header">
                  <h2 className="d_DS-chart-title">Recent Activities</h2>
                  <FaBell className="text-[#254D70]" />
                </div>
                <div className="d_DS-activities-list">
                  {(recentActivities || []).map((act, idx) => (
                    <div key={act.id || idx} className="d_DS-activity-item">
                      <div className="d_DS-activity-icon">
                        {act.type === 'order' && <FaShoppingCart />}
                        {act.type === 'product' && <FaBoxOpen />}
                        {act.type === 'customer' && <FaUsers />}
                        {act.type === 'cancel' && <FaArrowUp />}
                        {act.type === 'target' && <FaChartLine />}
                      </div>
                      <div className="d_DS-activity-content">
                        <p className="d_DS-activity-text">{act.message || act.text}</p>
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
                      <BarChart data={salesOverview} margin={{ top: 10, right: 0, left: 0, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e6eef5" />
                        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(m) => typeof m === 'number' ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][m - 1] : m} />
                        <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                        <Tooltip />
                        {/* Target and Achieved from salesTarget */}
                        <Bar dataKey="target" fill="#e6eef5" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="total" fill="#254D70" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="d_DS-target-stats">
                    <div className="d_DS-target-stat">
                      <span className="d_DS-target-label">Target</span>
                      <span className="d_DS-target-value">{formatCurrency(salesTarget?.target)}</span>
                    </div>
                    <div className="d_DS-target-stat">
                      <span className="d_DS-target-label">Achieved</span>
                      <span className="d_DS-target-value">{formatCurrency(salesTarget?.achieved)}</span>
                    </div>
                    <div className="d_DS-target-stat">
                      <span className="d_DS-target-label">Progress</span>
                      <span className="d_DS-target-value d_DS-target-progress">{salesTarget?.progress ?? 0}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders Table */}
            {/* You can add a dynamic orders table here if you fetch recent orders from backend */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;