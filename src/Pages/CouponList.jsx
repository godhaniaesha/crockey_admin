import React, { useState } from "react";
import "../style/z_style.css";
import { RiDeleteBin5Fill, RiEdit2Fill } from "react-icons/ri";
import { GrCaretNext, GrCaretPrevious } from "react-icons/gr";

const sampleCoupons = [
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=100&q=80",
    name: "Summer Sale",
    discount: "20%",
    code: "SUMMER20",
    startDate: "2024-06-01",
    endDate: "2024-06-30",
    status: true,
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=100&q=80",
    name: "New User",
    discount: "15%",
    code: "NEW15",
    startDate: "2024-06-05",
    endDate: "2024-07-05",
    status: false,
  },
  {
    id: 3,
    img: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=100&q=80",
    name: "Festive Offer",
    discount: "25%",
    code: "FEST25",
    startDate: "2024-07-01",
    endDate: "2024-07-31",
    status: true,
  },
  {
    id: 4,
    img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=100&q=80",
    name: "Monsoon Deal",
    discount: "10%",
    code: "MONSOON10",
    startDate: "2024-06-10",
    endDate: "2024-06-20",
    status: true,
  },
];

const ITEMS_PER_PAGE = 10;

function CouponList() {
  const [data, setData] = useState(sampleCoupons);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const handleDelete = (id) => {
    setData((prevData) => prevData.filter((item) => item.id !== id));
  };

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.code.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleStatusToggle = (id) => {
    setData((data) =>
      data.map((item) =>
        item.id === id ? { ...item, status: !item.status } : item
      )
    );
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="z_coupon_container">
      <div className="z_coupon_manage_content">
        <h3 className="z_coupon_title">Coupon List</h3>
        <div className="z_coupon_topbar">
          <div className="z_coupon_searchWrapper">
            <input
              className="z_coupon_search"
              type="text"
              placeholder="Search coupons..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
            <span className="z_coupon_searchIcon">
              {/* SVG search icon */}
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <circle cx="9" cy="9" r="7" stroke="#254d70" strokeWidth="2"/>
                <line x1="14.5" y1="14.5" x2="19" y2="19" stroke="#254d70" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </span>
          </div>
        </div>
      </div>
      <div className="z_coupon_tableWrapper">
        <table className="z_coupon_table">
          <thead>
            <tr className="z_coupon_tr">
              <th className="z_coupon_th">Coupon Details</th>
              <th className="z_coupon_th">Discount</th>
              <th className="z_coupon_th">Code</th>
              <th className="z_coupon_th">Start Date</th>
              <th className="z_coupon_th">End Date</th>
              <th className="z_coupon_th">Status</th>
              <th className="z_coupon_th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr className="z_coupon_tr" key={item.id}>
                <td className="z_coupon_td">
                  <div className="z_coupon_details_cell">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="z_coupon_img"
                    />
                    <span className="z_coupon_name">{item.name}</span>
                  </div>
                </td>
                <td className="z_coupon_td">{item.discount}</td>
                <td className="z_coupon_td">{item.code}</td>
                <td className="z_coupon_td">{item.startDate}</td>
                <td className="z_coupon_td">{item.endDate}</td>
                <td className="z_coupon_td">
                  <label className="z_coupon_switch">
                    <input
                      type="checkbox"
                      checked={item.status}
                      onChange={() => handleStatusToggle(item.id)}
                    />
                    <span className="z_coupon_slider"></span>
                  </label>
                </td>
                <td className="z_coupon_td">
                  <button
                    className="z_coupon_actionBtn z_coupon_editBtn"
                    title="Edit"
                  >
                    <RiEdit2Fill />
                  </button>
                  <button
                    className="z_coupon_actionBtn z_coupon_deleteBtn"
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
      <div className="z_coupon_pagin_container">
        <button
          className="z_coupon_pagin_btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <GrCaretPrevious />
        </button>
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx + 1}
            className={`z_coupon_pagin_btn${
              currentPage === idx + 1 ? " z_coupon_pagin_active" : ""
            }`}
            onClick={() => handlePageChange(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
        <button
          className="z_coupon_pagin_btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <GrCaretNext />
        </button>
      </div>
    </div>
  );
}

export default CouponList;