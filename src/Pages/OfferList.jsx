import React, { useState } from "react";
import "../style/z_style.css";
import { RiDeleteBin5Fill, RiEdit2Fill, RiEyeFill } from "react-icons/ri";
import { GrCaretNext, GrCaretPrevious } from "react-icons/gr";

const sampleOffers = [
  {
    id: 1,
    category: "Kitchenware",
    subcategory: "Dinner Sets",
    offerName: "Summer Bonanza",
    product: { name: "Dinner Set", img: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=100&q=80" },
    code: "SUMMER2024",
    price: 999,
    discount: "20%",
    startDate: "2024-06-01",
    endDate: "2024-06-30",
    status: true,
  },
  {
    id: 2,
    category: "Kitchenware",
    subcategory: "Tea Sets",
    offerName: "Monsoon Magic",
    product: { name: "Tea Set", img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=100&q=80" },
    code: "MONSOON10",
    price: 499,
    discount: "10%",
    startDate: "2024-07-01",
    endDate: "2024-07-15",
    status: false,
  },
  {
    id: 3,
    category: "Kitchenware",
    subcategory: "Glass Sets",
    offerName: "Festive Dhamaka",
    product: { name: "Glass Set", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=100&q=80" },
    code: "FESTIVE25",
    price: 799,
    discount: "25%",
    startDate: "2024-08-01",
    endDate: "2024-08-31",
    status: true,
  },
  {
    id: 4,
    category: "Storage",
    subcategory: "Containers",
    offerName: "New User Offer",
    product: { name: "Storage Container", img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=100&q=80" },
    code: "NEWUSER15",
    price: 299,
    discount: "15%",
    startDate: "2024-06-10",
    endDate: "2024-06-20",
    status: true,
  },
];

const ITEMS_PER_PAGE = 10;

function OfferList() {
  const [data, setData] = useState(sampleOffers);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const handleDelete = (id) => {
    setData((prevData) => prevData.filter((item) => item.id !== id));
  };

  const filteredData = data.filter(
    (item) =>
      item.offerName.toLowerCase().includes(search.toLowerCase()) ||
      item.code.toLowerCase().includes(search.toLowerCase()) ||
      item.product.name.toLowerCase().includes(search.toLowerCase())
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
    <div className="z_offer_container">
      <div className="z_offer_manage_content">
        <h3 className="z_offer_title">Offer List</h3>
        <div className="z_offer_topbar">
          <div className="z_offer_searchWrapper">
            <input
              className="z_offer_search"
              type="text"
              placeholder="Search offers..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
            <span className="z_offer_searchIcon">
              {/* SVG search icon */}
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <circle cx="9" cy="9" r="7" stroke="#254d70" strokeWidth="2" />
                <line x1="14.5" y1="14.5" x2="19" y2="19" stroke="#254d70" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
          </div>
          <button className="z_offer_addBtn">+ Add Offer</button>
        </div>
      </div>
      <div className="z_offer_tableWrapper">
        <table className="z_offer_table">
          <thead>
            <tr className="z_offer_tr">
              <th className="z_offer_th">Category</th>
              <th className="z_offer_th">Subcategory</th>
              <th className="z_offer_th">Product</th>
              <th className="z_offer_th">Offer Name</th>
              <th className="z_offer_th">Discount</th>
              <th className="z_offer_th">Code</th>
              <th className="z_offer_th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr className="z_offer_tr" key={item.id}>
                <td className="z_offer_td">{item.category}</td>
                <td className="z_offer_td">{item.subcategory}</td>
                <td className="z_offer_td">
                  <div className="z_offer_product_cell">
                    <img
                      src={item.product.img}
                      alt={item.product.name}
                      className="z_offer_product_img"
                    />
                    <span className="z_offer_product_name">{item.product.name}</span>
                  </div>
                </td>
                <td className="z_offer_td">{item.offerName}</td>
                <td className="z_offer_td">{item.discount}</td>
                <td className="z_offer_td">{item.code}</td>
                <td className="z_offer_td">
                  <button
                    className="z_offer_actionBtn z_offer_viewBtn"
                    title="View"
                  >
                    <RiEyeFill />
                  </button>
                  <button
                    className="z_offer_actionBtn z_offer_editBtn"
                    title="Edit"
                  >
                    <RiEdit2Fill />
                  </button>
                  <button
                    className="z_offer_actionBtn z_offer_deleteBtn"
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
      <div className="z_offer_pagin_container">
        <button
          className="z_offer_pagin_btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <GrCaretPrevious />
        </button>
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx + 1}
            className={`z_offer_pagin_btn${
              currentPage === idx + 1 ? " z_offer_pagin_active" : ""
            }`}
            onClick={() => handlePageChange(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
        <button
          className="z_offer_pagin_btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <GrCaretNext />
        </button>
      </div>
    </div>
  );
}

export default OfferList;