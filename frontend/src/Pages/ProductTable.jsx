import React, { useState, useEffect } from "react";
import "../style/z_style.css";
import { RiDeleteBin5Fill, RiEdit2Fill, RiSearchLine, RiEyeFill } from "react-icons/ri";
import { GrCaretNext, GrCaretPrevious } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, updateProduct } from "../redux/slice/product.slice";
import { fetchCategories } from "../redux/slice/category.slice";
import { fetchSubcategories } from "../redux/slice/subcat.slice.jsx";
import { useParams, useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 10;

function ProductTable() {
  const dispatch = useDispatch();
  const { products = [], loading = false, error = null } = useSelector(state => state.product) || {};
  const { categories = [] } = useSelector(state => state.category) || {};
  const { subcategories = [] } = useSelector(state => state.subcategory) || {};
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    dispatch(fetchSubcategories());
  }, [dispatch]);

  // Support both array and {result: array} API responses
  const safeProducts = Array.isArray(products?.result)
    ? products.result
    : Array.isArray(products)
    ? products
    : [];
  const safeCategories = Array.isArray(categories?.result)
    ? categories.result
    : Array.isArray(categories)
    ? categories
    : [];
  const safeSubcategories = Array.isArray(subcategories?.result)
    ? subcategories.result
    : Array.isArray(subcategories)
    ? subcategories
    : [];

  const filteredData = safeProducts.filter(
    (item) =>
      (item.name?.toLowerCase().includes(search.toLowerCase()) ||
        (item.category?.name || item.category || "").toLowerCase().includes(search.toLowerCase()) ||
        (item.subcategory?.name || item.subcategory || "").toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleStatusToggle = (id) => {
    // Implement status toggle API if needed
    // For now, just log
    console.log("Toggle status for product ID:", id);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (loading) {
    return <div className="z_prd_container">Loading products...</div>;
  }
  if (error) {
    return <div className="z_prd_container">Error: {error}</div>;
  }

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
              <th className="z_prd_th">Subcategory</th>
              <th className="z_prd_th">Price</th>
              <th className="z_prd_th">Stock</th>
              <th className="z_prd_th">Status</th>
              <th className="z_prd_th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => {
              const categoryName = item.category_id?.name || "-";
              const subcategoryName = item.subcategory_id?.name || "-";
              const colorArray = Array.isArray(item.colors)
                ? (typeof item.colors[0] === 'string' && item.colors[0].includes(',') ? item.colors[0].split(',').map(c => c.trim()) : item.colors)
                : [];
              return (
                <tr className="z_prd_tr" key={item._id || item.id}>
                  <td className="z_prd_td">
                    <div className="z_prd_details_cell">
                      <img
                        src={item.images && item.images.length > 0
                          ? `http://localhost:5000/uploads/${item.images[0]}`
                          : "https://via.placeholder.com/50"}
                        alt={item.name}
                        className="z_prd_img"
                      />
                      <div>
                        <div className="z_prd_name">{item.name}</div>
                        <div className="z_prd_size">
                          {colorArray.map((color, index) => (
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
                                    : color,
                              }}
                              title={color}
                            ></span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="z_prd_td">{categoryName}</td>
                  <td className="z_prd_td">{subcategoryName}</td>
                  <td className="z_prd_td">₹{item.price}</td>
                  <td className="z_prd_td">{item.stock}</td>
                  <td className="z_prd_td">
                    <label className="z_prd_switch">
                      <input
                        type="checkbox"
                        checked={item.active || false}
                        onChange={() => {/* handle status toggle */}}
                      />
                      <span className="z_prd_slider"></span>
                    </label>
                  </td>
                  <td className="z_prd_td">
                    <button
                      className="z_prd_actionBtn z_prd_viewBtn"
                      title="View"
                      onClick={() => {
                        // TODO: View product modal or details
                      }}
                    >
                      <RiEyeFill />
                    </button>
                    <button
                      className="z_prd_actionBtn z_prd_editBtn"
                      title="Edit"
                      onClick={() => navigate(`/product/edit/${item._id || item.id}`)}
                    >
                      <RiEdit2Fill />
                    </button>
                    <button
                      className="z_prd_actionBtn z_prd_deleteBtn"
                      title="Delete"
                      onClick={() => {
                        // TODO: Delete product
                      }}
                    >
                      <RiDeleteBin5Fill />
                    </button>
                  </td>
                </tr>
              );
            })}
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