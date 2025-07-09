import React, { useState } from "react";
import "../style/z_style.css";
import { RiDeleteBin5Fill, RiEdit2Fill, RiSearchLine, RiEyeFill } from "react-icons/ri";
import { GrCaretNext, GrCaretPrevious } from "react-icons/gr";

const sampleData = [
  // Plates
  {
    id: 1,
    name: "Classic Dinner Plate",
    img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=100&q=80",
    category: "Plates",
    discount_price: 299,
    stock: 30,
    status: true,
    color: ["White", "Blue"],
  },
  {
    id: 2,
    name: "Modern Side Plate",
    img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=100&q=80",
    category: "Plates",
    discount_price: 199,
    stock: 25,
    status: true,
    color: ["Ivory"],
  },
  // Bowls
  {
    id: 3,
    name: "Soup Bowl Set",
    img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=100&q=80",
    category: "Bowls",
    discount_price: 399,
    stock: 20,
    status: true,
    color: ["Cream", "Green"],
  },
  {
    id: 4,
    name: "Salad Bowl Large",
    img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=100&q=80",
    category: "Bowls",
    discount_price: 349,
    stock: 15,
    status: false,
    color: ["Green"],
  },
  // Cups & Mugs
  {
    id: 5,
    name: "Porcelain Tea Cup",
    img: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=100&q=80",
    category: "Cups & Mugs",
    discount_price: 149,
    stock: 40,
    status: true,
    color: ["White"],
  },
  {
    id: 6,
    name: "Classic Coffee Mug",
    img: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=100&q=80",
    category: "Cups & Mugs",
    discount_price: 179,
    stock: 35,
    status: true,
    color: ["Blue", "Black"],
  },
  // Glasses
  {
    id: 7,
    name: "Water Glass Set",
    img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=100&q=80",
    category: "Glasses",
    discount_price: 299,
    stock: 28,
    status: true,
    color: ["Transparent"],
  },
  {
    id: 8,
    name: "Wine Glass Pair",
    img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=100&q=80",
    category: "Glasses",
    discount_price: 499,
    stock: 12,
    status: false,
    color: ["Transparent", "Green"],
  },
  // Spoons & Cutlery
  {
    id: 9,
    name: "Dinner Spoon Set",
    img: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=100&q=80",
    category: "Spoons & Cutlery",
    discount_price: 199,
    stock: 50,
    status: true,
    color: ["Silver"],
  },
  {
    id: 10,
    name: "Classic Forks",
    img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=100&q=80",
    category: "Spoons & Cutlery",
    discount_price: 189,
    stock: 45,
    status: true,
    color: ["Silver", "Black"],
  },
  // Serving Dishes
  {
    id: 11,
    name: "Oval Serving Platter",
    img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=100&q=80",
    category: "Serving Dishes",
    discount_price: 399,
    stock: 18,
    status: true,
    color: ["White", "Beige"],
  },
  {
    id: 12,
    name: "Large Serving Bowl",
    img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=100&q=80",
    category: "Serving Dishes",
    discount_price: 349,
    stock: 16,
    status: false,
    color: ["Beige"],
  },
  // Tea Sets
  {
    id: 13,
    name: "Ceramic Tea Pot",
    img: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=100&q=80",
    category: "Tea Sets",
    discount_price: 599,
    stock: 10,
    status: true,
    color: ["White", "Silver"],
  },
  // Jugs & Pitchers
  {
    id: 14,
    name: "Glass Water Jug",
    img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=100&q=80",
    category: "Jugs & Pitchers",
    discount_price: 299,
    stock: 14,
    status: true,
    color: ["Transparent", "Blue"],
  },
  // Storage Containers
  {
    id: 15,
    name: "Glass Storage Jar",
    img: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=100&q=80",
    category: "Storage Containers",
    discount_price: 159,
    stock: 22,
    status: true,
    color: ["Transparent"],
  },
];

const ITEMS_PER_PAGE = 10;

function ProductTable() {
  const [data, setData] = useState(sampleData);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
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
    <div className="z_prd_container">
      <div className="z_prd_manage_content">
        <h3 className="z_prd_title">Products List</h3>
        <div className="z_prd_topbar">
          <div className="z_prd_searchWrapper">
            <input
              className="z_prd_search"
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
            <RiSearchLine className="z_prd_searchIcon" />
          </div>
          <button className="z_prd_addBtn">+ Add Product</button>
        </div>
      </div>

      <div className="z_prd_tableWrapper">
        <table className="z_prd_table">
          <thead>
            <tr className="z_prd_tr">
              <th className="z_prd_th">Product Name & Size</th>
              <th className="z_prd_th">Category</th>
              <th className="z_prd_th">Discount Price</th>
              <th className="z_prd_th">Stock</th>
              <th className="z_prd_th">Status</th>
              <th className="z_prd_th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr className="z_prd_tr" key={item.id}>
                <td className="z_prd_td">
                  <div className="z_prd_details_cell">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="z_prd_img"
                    />
                    <div>
                      <div className="z_prd_name">{item.name}</div>
                      <div className="z_prd_size">
                        {item.color.map((color, index) => (
                          <span
                            key={index}
                            className="z_prd_color_circle"
                            style={{
                              background:
                                color === "Transparent"
                                  ? "linear-gradient(45deg, #fff 60%, #ccc 100%)"
                                  : color === "Ivory"
                                  ? "#fffff0"
                                  : color === "Cream"
                                  ? "#fffdd0"
                                  : color === "Beige"
                                  ? "#f5f5dc"
                                  : color === "Silver"
                                  ? "#c0c0c0"
                                  : color === "White"
                                  ? "#fff"
                                  : color === "Black"
                                  ? "#000"
                                  : color, // fallback for named/hex colors
                            }}
                            title={color}
                          ></span>
                        ))}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="z_prd_td">{item.category}</td>
                <td className="z_prd_td">₹{item.discount_price}</td>
                <td className="z_prd_td">{item.stock}</td>
                <td className="z_prd_td">
                  <label className="z_prd_switch">
                    <input
                      type="checkbox"
                      checked={item.status}
                      onChange={() => handleStatusToggle(item.id)}
                    />
                    <span className="z_prd_slider"></span>
                  </label>
                </td>
                <td className="z_prd_td">
                  <button
                    className="z_prd_actionBtn z_prd_viewBtn"
                    title="View"
                    onClick={() => {
                      // Modal functionality removed
                    }}
                  >
                    <RiEyeFill />
                  </button>
                  <button
                    className="z_prd_actionBtn z_prd_editBtn"
                    title="Edit"
                  >
                    <RiEdit2Fill />
                  </button>
                  <button
                    className="z_prd_actionBtn z_prd_deleteBtn"
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
      <div className="z_prd_pagin_container">
        <button
          className="z_prd_pagin_btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <GrCaretPrevious />
        </button>
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx + 1}
            className={`z_prd_pagin_btn${
              currentPage === idx + 1 ? " z_prd_pagin_active" : ""
            }`}
            onClick={() => handlePageChange(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
        <button
          className="z_prd_pagin_btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <GrCaretNext />
        </button>
      </div>
    </div>
  );
}

export default ProductTable;