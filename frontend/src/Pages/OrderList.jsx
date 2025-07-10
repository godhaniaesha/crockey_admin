import React, { useState } from "react";
import "../style/z_style.css";
import { RiDeleteBin5Fill, RiEdit2Fill } from "react-icons/ri";
import { GrCaretNext, GrCaretPrevious } from "react-icons/gr";

const sampleOrders = [
  {
    id: "ORD-1001",
    createdAt: "2024-06-01 10:15",
    customer: "John Doe",
    items: 3,
    total: 1299,
    paymentStatus: "Paid",
    deliveryNumber: "DEL-001",
    orderStatus: "Delivered",
  },
  {
    id: "ORD-1002",
    createdAt: "2024-06-02 14:22",
    customer: "Jane Smith",
    items: 2,
    total: 799,
    paymentStatus: "Pending",
    deliveryNumber: "DEL-002",
    orderStatus: "Processing",
  },
  {
    id: "ORD-1003",
    createdAt: "2024-06-03 09:05",
    customer: "Alice Johnson",
    items: 5,
    total: 1999,
    paymentStatus: "Paid",
    deliveryNumber: "DEL-003",
    orderStatus: "Shipped",
  },
  {
    id: "ORD-1004",
    createdAt: "2024-06-04 16:40",
    customer: "Bob Lee",
    items: 1,
    total: 299,
    paymentStatus: "Failed",
    deliveryNumber: "DEL-004",
    orderStatus: "Cancelled",
  },
];

const ITEMS_PER_PAGE = 10;

function OrderList() {
  const [data, setData] = useState(sampleOrders);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const handleDelete = (id) => {
    setData((prevData) => prevData.filter((item) => item.id !== id));
  };

  const filteredData = data.filter(
    (item) =>
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.customer.toLowerCase().includes(search.toLowerCase()) ||
      item.orderStatus.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="z_odrHis_container">
      <div className="z_odrHis_manage_content">
        <h3 className="z_odrHis_title">Order History</h3>
        <div className="z_odrHis_topbar">
          <div className="z_odrHis_searchWrapper">
            <input
              className="z_odrHis_search"
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
            <span className="z_odrHis_searchIcon">
              {/* SVG search icon */}
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <circle cx="9" cy="9" r="7" stroke="#254d70" strokeWidth="2"/>
                <line x1="14.5" y1="14.5" x2="19" y2="19" stroke="#254d70" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </span>
          </div>
          <div className="z_modifyDRp_wrapper">
            <select className="z_modifyDRp_">
              <option value="all">All</option>
              <option value="this">This Month</option>
              <option value="last">Last Month</option>
            </select>
            <span className="z_modifyDRp_icon">
              {/* SVG caret down icon */}
              <svg width="20" height="20" viewBox="0 0 20 20" fill="#254d70">
                <path d="M7 8l3 3 3-3" stroke="#254d70" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </div>
        </div>
      </div>
      <div className="z_odrHis_tableWrapper">
        <table className="z_odrHis_table">
          <thead>
            <tr className="z_odrHis_tr">
              <th className="z_odrHis_th">Order Id</th>
              <th className="z_odrHis_th">Created At</th>
              <th className="z_odrHis_th">Customer Name</th>
              <th className="z_odrHis_th">Items</th>
              <th className="z_odrHis_th">Total</th>
              <th className="z_odrHis_th">Payment Status</th>
              <th className="z_odrHis_th">Delivery Number</th>
              <th className="z_odrHis_th">Order Status</th>
              <th className="z_odrHis_th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, idx) => (
              <tr className="z_odrHis_tr" key={item.id}>
                <td className="z_odrHis_td">{item.id}</td>
                <td className="z_odrHis_td">{item.createdAt}</td>
                <td className="z_odrHis_td">{item.customer}</td>
                <td className="z_odrHis_td">{item.items}</td>
                <td className="z_odrHis_td">₹{item.total}</td>
                <td className="z_odrHis_td">
                  <span
                    className={`z_odrHis_paymentBadge z_odrHis_payment--${item.paymentStatus.toLowerCase()}`}
                  >
                    {item.paymentStatus}
                  </span>
                </td>
                <td className="z_odrHis_td">{item.deliveryNumber}</td>
                <td className="z_odrHis_td">
                  <span
                    className={`z_odrHis_statusBadge z_odrHis_status--${item.orderStatus.toLowerCase()}`}
                  >
                    {item.orderStatus}
                  </span>
                </td>
                <td className="z_odrHis_td">
                  <button
                    className="z_odrHis_actionBtn z_odrHis_editBtn"
                    title="Edit"
                  >
                    <RiEdit2Fill />
                  </button>
                  <button
                    className="z_odrHis_actionBtn z_odrHis_deleteBtn"
                    title="Delete"
                    onClick={() => handleDelete(item.id)}
                  >
                    <RiDeleteBin5Fill />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="z_odrHis_pagin_container">
        <button
          className="z_odrHis_pagin_btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <GrCaretPrevious />
        </button>
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx + 1}
            className={`z_odrHis_pagin_btn${
              currentPage === idx + 1 ? " z_odrHis_pagin_active" : ""
            }`}
            onClick={() => handlePageChange(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
        <button
          className="z_odrHis_pagin_btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <GrCaretNext />
        </button>
      </div>
    </div>
  );
}

export default OrderList;
