import React, { useState } from "react";
import "../style/z_style.css";
import { RiDeleteBin5Fill, RiEdit2Fill } from "react-icons/ri";
import { GrCaretNext, GrCaretPrevious } from "react-icons/gr";

const sampleCustomers = [
  {
    id: "CUST-1001",
    name: "John Doe",
    email: "john@example.com",
    lastOrder: "2024-06-01",
    status: true,
  },
  {
    id: "CUST-1002",
    name: "Jane Smith",
    email: "jane@example.com",
    lastOrder: "2024-05-28",
    status: false,
  },
  {
    id: "CUST-1003",
    name: "Alice Johnson",
    email: "alice@example.com",
    lastOrder: "2024-06-03",
    status: true,
  },
  {
    id: "CUST-1004",
    name: "Bob Lee",
    email: "bob@example.com",
    lastOrder: "2024-05-30",
    status: true,
  },
];

const ITEMS_PER_PAGE = 10;

function CustomerList() {
  const [data, setData] = useState(sampleCustomers);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const filteredData = data.filter(
    (item) =>
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase())
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
    <div className="z_custmr_container">
      <div className="z_custmr_manage_content">
        <h3 className="z_custmr_title">Customer List</h3>
        <div className="z_custmr_topbar">
          <div className="z_custmr_searchWrapper">
            <input
              className="z_custmr_search"
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
            <span className="z_custmr_searchIcon">
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
                <path
                  d="M7 8l3 3 3-3"
                  stroke="#254d70"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
      <div className="z_custmr_tableWrapper">
        <table className="z_custmr_table">
          <thead>
            <tr className="z_custmr_tr">
              <th className="z_custmr_th">Customer ID</th>
              <th className="z_custmr_th">Name</th>
              <th className="z_custmr_th">Email</th>
              <th className="z_custmr_th">Last Order Date</th>
              <th className="z_custmr_th">Status</th>
              <th className="z_custmr_th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr className="z_custmr_tr" key={item.id}>
                <td className="z_custmr_td">{item.id}</td>
                <td className="z_custmr_td">{item.name}</td>
                <td className="z_custmr_td">{item.email}</td>
                <td className="z_custmr_td">{item.lastOrder}</td>
                <td className="z_custmr_td">
                  <label className="z_custmr_switch">
                    <input
                      type="checkbox"
                      checked={item.status}
                      onChange={() => handleStatusToggle(item.id)}
                    />
                    <span className="z_custmr_slider"></span>
                  </label>
                </td>
                <td className="z_custmr_td">
                  <button
                    className="z_custmr_actionBtn z_custmr_editBtn"
                    title="Edit"
                  >
                    <RiEdit2Fill />
                  </button>
                  <button
                    className="z_custmr_actionBtn z_custmr_deleteBtn"
                    title="Delete"
                  >
                    <RiDeleteBin5Fill />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="z_custmr_pagin_container">
        <button
          className="z_custmr_pagin_btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <GrCaretPrevious />
        </button>
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx + 1}
            className={`z_custmr_pagin_btn${
              currentPage === idx + 1 ? " z_custmr_pagin_active" : ""
            }`}
            onClick={() => handlePageChange(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
        <button
          className="z_custmr_pagin_btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <GrCaretNext />
        </button>
      </div>
    </div>
  );
}

export default CustomerList;
