import React, { useState } from "react";
import "../style/z_style.css";
import { RiDeleteBin5Fill, RiEdit2Fill, RiSearchLine } from "react-icons/ri";
import { GrCaretNext, GrCaretPrevious } from "react-icons/gr";

const sampleData = [
  // Plates
  {
    subcat_id: 1,
    category_name: "Plates",
    subcategory_details: "Dinner Plate",
    img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=100&q=80",
    description: "Large plates for main courses.",
    status: true,
  },
  {
    subcat_id: 2,
    category_name: "Plates",
    subcategory_details: "Side Plate",
    img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=100&q=80",
    description: "Small plates for sides and snacks.",
    status: true,
  },
  // Bowls
  {
    subcat_id: 3,
    category_name: "Bowls",
    subcategory_details: "Soup Bowl",
    img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=100&q=80",
    description: "Deep bowls for soup and stews.",
    status: true,
  },
  {
    subcat_id: 4,
    category_name: "Bowls",
    subcategory_details: "Salad Bowl",
    img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=100&q=80",
    description: "Wide bowls for salads.",
    status: false,
  },
  // Cups & Mugs
  {
    subcat_id: 5,
    category_name: "Cups & Mugs",
    subcategory_details: "Tea Cup",
    img: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=100&q=80",
    description: "Elegant cups for tea.",
    status: true,
  },
  {
    subcat_id: 6,
    category_name: "Cups & Mugs",
    subcategory_details: "Coffee Mug",
    img: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=100&q=80",
    description: "Large mugs for coffee.",
    status: true,
  },
  // Glasses
  {
    subcat_id: 7,
    category_name: "Glasses",
    subcategory_details: "Water Glass",
    img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=100&q=80",
    description: "Glasses for water and soft drinks.",
    status: true,
  },
  {
    subcat_id: 8,
    category_name: "Glasses",
    subcategory_details: "Wine Glass",
    img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=100&q=80",
    description: "Elegant glasses for wine.",
    status: false,
  },
  // Spoons & Cutlery
  {
    subcat_id: 9,
    category_name: "Spoons & Cutlery",
    subcategory_details: "Dinner Spoon",
    img: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=100&q=80",
    description: "Spoons for main courses.",
    status: true,
  },
  {
    subcat_id: 10,
    category_name: "Spoons & Cutlery",
    subcategory_details: "Fork",
    img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=100&q=80",
    description: "Forks for eating and serving.",
    status: true,
  },
  // Serving Dishes
  {
    subcat_id: 11,
    category_name: "Serving Dishes",
    subcategory_details: "Serving Platter",
    img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=100&q=80",
    description: "Platters for serving food.",
    status: true,
  },
  {
    subcat_id: 12,
    category_name: "Serving Dishes",
    subcategory_details: "Serving Bowl",
    img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=100&q=80",
    description: "Large bowls for serving.",
    status: false,
  },
  // Tea Sets
  {
    subcat_id: 13,
    category_name: "Tea Sets",
    subcategory_details: "Tea Pot",
    img: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=100&q=80",
    description: "Pots for brewing tea.",
    status: true,
  },
  {
    subcat_id: 14,
    category_name: "Tea Sets",
    subcategory_details: "Milk Jug",
    img: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=100&q=80",
    description: "Jugs for serving milk.",
    status: true,
  },
  // Jugs & Pitchers
  {
    subcat_id: 15,
    category_name: "Jugs & Pitchers",
    subcategory_details: "Water Jug",
    img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=100&q=80",
    description: "Jugs for water and beverages.",
    status: true,
  },
  {
    subcat_id: 16,
    category_name: "Jugs & Pitchers",
    subcategory_details: "Pitcher",
    img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=100&q=80",
    description: "Pitchers for serving drinks.",
    status: false,
  },
  // Baking Dishes
  {
    subcat_id: 17,
    category_name: "Baking Dishes",
    subcategory_details: "Casserole Dish",
    img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=100&q=80",
    description: "Oven-safe dishes for casseroles.",
    status: true,
  },
  {
    subcat_id: 18,
    category_name: "Baking Dishes",
    subcategory_details: "Pie Dish",
    img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=100&q=80",
    description: "Dishes for baking pies.",
    status: true,
  },
  // Storage Containers
  {
    subcat_id: 19,
    category_name: "Storage Containers",
    subcategory_details: "Glass Storage Jar",
    img: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=100&q=80",
    description: "Jars for storing ingredients.",
    status: true,
  },
  {
    subcat_id: 20,
    category_name: "Storage Containers",
    subcategory_details: "Plastic Storage Box",
    img: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=100&q=80",
    description: "Boxes for storing leftovers.",
    status: false,
  },
];

const ITEMS_PER_PAGE = 10;

function SubcategoryList(props) {
  const [data, setData] = useState(sampleData);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const handleDelete = (id) => {
    setData((prevData) => prevData.filter((item) => item.subcat_id !== id));
  };

  const filteredData = data.filter(
    (item) =>
      item.category_name.toLowerCase().includes(search.toLowerCase()) ||
      item.subcategory_details.toLowerCase().includes(search.toLowerCase()) ||
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
        item.subcat_id === id ? { ...item, status: !item.status } : item
      )
    );
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="z_subcat_container">
      <div className="z_subcat_manage_content">
        <h3 className="z_subcat_title">Subcategories List</h3>
        <div className="z_subcat_topbar">
          <div className="z_subcat_searchWrapper">
            <input
              className="z_subcat_search"
              type="text"
              placeholder="Search subcategories..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
            <RiSearchLine className="z_subcat_searchIcon" />
          </div>
          <button className="z_subcat_addBtn">+ Add Subcategory</button>
        </div>
      </div>

      <div className="z_subcat_tableWrapper">
        <table className="z_subcat_table">
          <thead>
            <tr className="z_subcat_tr">
              <th className="z_subcat_th">Subcat ID</th>
              <th className="z_subcat_th">Category Name</th>
              <th className="z_subcat_th">Subcategory Details</th>
              <th className="z_subcat_th">Description</th>
              <th className="z_subcat_th">Status</th>
              <th className="z_subcat_th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr className="z_subcat_tr" key={item.subcat_id}>
                <td className="z_subcat_td">{item.subcat_id}</td>
                <td className="z_subcat_td">{item.category_name}</td>
                <td className="z_subcat_td">
                  <div className="z_subcat_details_cell">
                    <img
                      src={item.img}
                      alt={item.subcategory_details}
                      className="z_subcat_img"
                    />
                    <span className="z_subcat_name">{item.subcategory_details}</span>
                  </div>
                </td>
                <td className="z_subcat_td">{item.description}</td>
                <td className="z_subcat_td">
                  <label className="z_subcat_switch">
                    <input
                      type="checkbox"
                      checked={item.status}
                      onChange={() => handleStatusToggle(item.subcat_id)}
                    />
                    <span className="z_subcat_slider"></span>
                  </label>
                </td>
                <td className="z_subcat_td">
                  <button
                    className="z_subcat_actionBtn z_subcat_editBtn"
                    title="Edit"
                  >
                    <RiEdit2Fill />
                  </button>
                  <button
                    className="z_subcat_actionBtn z_subcat_deleteBtn"
                    title="Delete"
                    onClick={() => handleDelete(item.subcat_id)}
                  >
                    <RiDeleteBin5Fill />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="z_subcat_pagin_container">
        <button
          className="z_subcat_pagin_btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <GrCaretPrevious />
        </button>
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx + 1}
            className={`z_subcat_pagin_btn${
              currentPage === idx + 1 ? " z_subcat_pagin_active" : ""
            }`}
            onClick={() => handlePageChange(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
        <button
          className="z_subcat_pagin_btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <GrCaretNext />
        </button>
      </div>
    </div>
  );
}

export default SubcategoryList;