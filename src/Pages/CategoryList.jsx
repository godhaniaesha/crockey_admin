import React, { useState } from "react";
import "../style/z_style.css";
import { RiDeleteBin5Fill, RiEdit2Fill } from "react-icons/ri";
import { GrCaretNext, GrCaretPrevious } from "react-icons/gr";

const sampleData = [
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=100&q=80",
    category: "Plates",
    description: "Various sizes of dinner and side plates.",
    status: true,
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=100&q=80",
    category: "Bowls",
    description: "Soup, salad, and serving bowls.",
    status: false,
  },
  {
    id: 3,
    img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=100&q=80",
    category: "Cups & Mugs",
    description: "Tea cups, coffee mugs, and more.",
    status: true,
  },
  {
    id: 4,
    img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=100&q=80",
    category: "Glasses",
    description: "Drinking glasses for water, juice, and beverages.",
    status: false,
  },
  {
    id: 5,
    img: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=100&q=80",
    category: "Spoons & Cutlery",
    description: "Spoons, forks, knives, and serving utensils.",
    status: true,
  },
  {
    id: 6,
    img: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=100&q=80",
    category: "Serving Dishes",
    description: "Platters, trays, and serving bowls.",
    status: true,
  },
  {
    id: 7,
    img: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=100&q=80",
    category: "Tea Sets",
    description: "Complete tea sets for serving guests.",
    status: false,
  },
  {
    id: 8,
    img: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=100&q=80",
    category: "Jugs & Pitchers",
    description: "Water jugs and beverage pitchers.",
    status: true,
  },
  {
    id: 9,
    img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=100&q=80",
    category: "Baking Dishes",
    description: "Oven-safe dishes for baking.",
    status: false,
  },
  {
    id: 10,
    img: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=100&q=80",
    category: "Storage Containers",
    description: "Containers for storing leftovers and ingredients.",
    status: true,
  },
];

const ITEMS_PER_PAGE = 10; // You can change this as needed

function CategoryList(props) {
  const [data, setData] = useState(sampleData);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const filteredData = data.filter(
    (item) =>
      item.category.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
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
    <div className="z_catList_container">
      <div className="z_manage_content">
        <h3 className="z_catList_title">Categories List</h3>
        <div className="z_catList_topbar">
          <input
            className="z_catList_search"
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
          <button className="z_catList_addBtn">+ Add Category</button>
        </div>
      </div>

      <div className="z_catList_tableWrapper">
        <table className="z_catList_table">
          <thead>
            <tr className="z_catList_tr">
              <th className="z_catList_th">ID</th>
              <th className="z_catList_th">Image</th>
              <th className="z_catList_th">Category Name</th>
              <th className="z_catList_th">Description</th>
              <th className="z_catList_th">Status</th>
              <th className="z_catList_th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr className="z_catList_tr" key={item.id}>
                <td className="z_catList_td">{item.id}</td>
                <td className="z_catList_td">
                  <img
                    src={item.img}
                    alt={item.category}
                    className="z_catList_img"
                  />
                </td>
                <td className="z_catList_td">{item.category}</td>
                <td className="z_catList_td">{item.description}</td>
                <td className="z_catList_td">
                  <label className="z_switch">
                    <input
                      type="checkbox"
                      checked={item.status}
                      onChange={() => handleStatusToggle(item.id)}
                    />
                    <span className="z_slider"></span>
                  </label>
                </td>
                <td className="z_catList_td">
                  <button
                    className="z_catList_actionBtn z_catList_editBtn"
                    title="Edit"
                  >
                    <RiEdit2Fill />
                  </button>
                  <button
                    className="z_catList_actionBtn z_catList_deleteBtn"
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
      <div className="z_pagin_container">
        <button
          className="z_pagin_btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <GrCaretPrevious />
        </button>
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx + 1}
            className={`z_pagin_btn${
              currentPage === idx + 1 ? " z_pagin_active" : ""
            }`}
            onClick={() => handlePageChange(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
        <button
          className="z_pagin_btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <GrCaretNext />
        </button>
      </div>
    </div>
  );
}

export default CategoryList;
