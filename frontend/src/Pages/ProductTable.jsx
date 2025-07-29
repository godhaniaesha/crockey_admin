import React, { useState, useEffect } from "react";
import "../style/z_style.css";
import { RiDeleteBin5Fill, RiEdit2Fill, RiSearchLine, RiEyeFill } from "react-icons/ri";
import { GrCaretNext, GrCaretPrevious } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, updateProduct, deleteProduct, toggleProductStatus } from "../redux/slice/product.slice";
import { fetchCategories } from "../redux/slice/category.slice";
import { fetchSubcategories } from "../redux/slice/subcat.slice.jsx";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "./Spinner";

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
  const [deleteMessage, setDeleteMessage] = useState("");
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [togglingProductId, setTogglingProductId] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    dispatch(fetchSubcategories());
  }, [dispatch]);

  // Handle delete success message
  useEffect(() => {
    if (deleteMessage) {
      // alert(deleteMessage);
      setDeleteMessage("");
    }
  }, [deleteMessage]);

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

  const handleStatusToggle = async (id) => {
    setTogglingProductId(id);
    const result = await dispatch(toggleProductStatus(id));
    setTogglingProductId(null);

    if (result.meta.requestStatus === 'rejected') {
      console.error("Toggle error:", result.payload);
      alert("Error toggling product status: " + result.payload);
    } else {
      // Refetch products to get updated category/subcategory info
      dispatch(fetchProducts());
    }
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const confirmDelete = async () => {
    setDeletingProductId(deleteId);
    const result = await dispatch(deleteProduct(deleteId));
    setDeletingProductId(null);
    closeDeleteModal();
    
    if (result.meta.requestStatus === 'fulfilled') {
      setDeleteMessage("Product deleted successfully!");
    } else if (result.meta.requestStatus === 'rejected') {
      alert("Error deleting product: " + result.payload);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (loading) {
    return <Spinner />;
  }
  if (error) {
    return <div className="z_prd_container">Error: {error}</div>;
  }

  console.log("Products being rendered:", filteredData);

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
          <button 
            className="z_prd_addBtn" 
            onClick={() => navigate('/product/add')}
          >
            + Add Product
          </button>
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
              // Truncate helpers
              const truncate = (str, n) => str && str.length > n ? str.substring(0, n) + "..." : str;
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
                        <div className="z_prd_name">
                          {truncate(item.name, 30)}
                        </div>
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
                  <td className="z_prd_td">{truncate(categoryName, 20)}</td>
                  <td className="z_prd_td">{truncate(subcategoryName, 20)}</td>
                  <td className="z_prd_td">₹{item.price}</td>
                  <td className="z_prd_td">{item.stock}</td>
                  <td className="z_prd_td">
                    <label className="z_prd_switch">
                      <input
                        type="checkbox"
                        checked={item.active || false}
                        onChange={() => handleStatusToggle(item._id || item.id)}
                        disabled={togglingProductId === (item._id || item.id)}
                      />
                      <span className="z_prd_slider"></span>
                    </label>
                    <span
                      style={{
                        marginLeft: '10px',
                        color: item.active ? 'green' : 'red',
                        fontWeight: 500,
                        textTransform: 'capitalize',
                      }}
                    >
                      {/* {item.active ? 'activated' : 'deactivated'} */}
                    </span>
                    {togglingProductId === (item._id || item.id) && (
                      <span style={{ marginLeft: '5px', fontSize: '12px', color: '#666' }}>
                        Updating...
                      </span>
                    )}
                  </td>
                  <td className="z_prd_td">
                    <button
                      className="z_prd_actionBtn z_prd_viewBtn"
                      title="View"
                      onClick={() => {
                        navigate(`/product/detail?id=${item._id || item.id}`);
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
                      onClick={() => openDeleteModal(item._id || item.id)}
                      disabled={deletingProductId === (item._id || item.id)}
                    >
                      {deletingProductId === (item._id || item.id) ? (
                        <span>...</span>
                      ) : (
                        <RiDeleteBin5Fill />
                      )}
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
      {showDeleteModal && (
        <div className="z_dltModal_overlay">
          <div className="z_dltModal_content z_dltModal_noRadius">
            {deleteId && (() => {
              const product = safeProducts.find(p => p._id === deleteId || p.id === deleteId);
              return product ? (
                <img
                  src={product.images && product.images.length > 0
                    ? `http://localhost:5000/uploads/${product.images[0]}`
                    : "https://via.placeholder.com/50"}
                  alt={product.name}
                  className="z_dltModal_img"
                />
              ) : null;
            })()}
            <h2 className="z_dltModal_title">Delete Product</h2>
            <p className="z_dltModal_text">
              Are you sure you want to delete <b>{safeProducts.find(p => p._id === deleteId || p.id === deleteId)?.name}</b>?
            </p>
            <div className="z_dltModal_btnGroup">
              <button className="z_dltModal_btn z_dltModal_cancel" onClick={closeDeleteModal}>
                Cancel
              </button>
              <button 
                className="z_dltModal_btn z_dltModal_confirm" 
                onClick={confirmDelete}
                disabled={deletingProductId === deleteId}
              >
                {deletingProductId === deleteId ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductTable;