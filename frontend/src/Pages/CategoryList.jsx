import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, deleteCategory, toggleCategoryStatus } from "../redux/slice/category.slice";
import "../style/z_style.css";
import { RiDeleteBin5Fill, RiEdit2Fill } from "react-icons/ri";
import { GrCaretNext, GrCaretPrevious } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import { jwtDecode } from "jwt-decode";

// Sample data for fallback
const sampleData = [];

const ITEMS_PER_PAGE = 10; // You can change this as needed

function CategoryList(props) {
  const dispatch = useDispatch();
  const categoryState = useSelector((state) => state?.category);
  const { categories = [], loading = false, error = null } = categoryState || {};

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const confirmDelete = () => {
    handleDelete(deleteId);
    closeDeleteModal();
  };

  // Debug logging
  console.log('Category State:', categoryState.categories);
  console.log('Categories:', categories);

  // Fetch categories on component mount
  useEffect(() => {
    console.log('Dispatching fetchCategories...');
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      dispatch(deleteCategory(id));
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-category/${id}`);
  };

  const [togglingCategoryId, setTogglingCategoryId] = useState(null);

  const handleStatusToggle = async (id) => {
    setTogglingCategoryId(id);
    const result = await dispatch(toggleCategoryStatus(id));
    setTogglingCategoryId(null);

    if (result.meta.requestStatus === 'rejected') {
      alert("Error toggling category status: " + result.payload);
    } else {
      dispatch(fetchCategories()); // Refresh to get correct status and data
    }
  };

  // Always use the array for rendering
  const safeCategories = Array.isArray(categories?.result)
    ? categories.result
    : Array.isArray(categories)
      ? categories
      : [];

  const filteredData = safeCategories.filter(
    (item) =>
      item?.name?.toLowerCase().includes(search.toLowerCase()) ||
      item?.description?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const categoryToDelete = safeCategories.find(cat => cat._id === deleteId);

  let userRole = null;
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userRole = decoded.role; // Adjust if your backend puts role elsewhere
    } catch (e) {
      userRole = null;
    }
  }
  const isAdmin = userRole === 'admin';

  // Show loading state
  if (loading) {
    return <Spinner />;
  }

  // Show error state
  if (error) {
    return (
      <div className="z_catList_container">
        <div className="z_manage_content">
          <h3 className="z_catList_title">Categories List</h3>
          <div>Error: {error}</div>
        </div>
      </div>
    );
  }
  const truncate = (str, n) => str && str.length > n ? str.substring(0, n) + "..." : str;
  return (
    <>
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
            {isAdmin && (
              <button
                className="z_catList_addBtn"
                onClick={() => navigate('/category/add')}
              >
                + Add Category
              </button>
            )}
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
                {isAdmin && <th className="z_catList_th">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item) => (
                <tr className="z_catList_tr" key={item._id}>
                  <td className="z_catList_td">{item._id}</td>
                  <td className="z_catList_td">
                    <img
                      src={item.image ? `http://localhost:5000/uploads/${item.image}` : "https://via.placeholder.com/50"}
                      alt={item.name}
                      className="z_catList_img"
                    />
                  </td>
                  <td className="z_catList_td">{truncate(item.name, 20)}</td>
                  <td className="z_catList_td">
                    {item.description && item.description.length > 50
                      ? `${item.description.substring(0, 50)}...`
                      : item.description}
                  </td>
                  <td className="z_catList_td">
                    <label className="z_switch">
                      <input
                        type="checkbox"
                        checked={item.active || false}
                        onChange={() => handleStatusToggle(item._id)}
                        disabled={togglingCategoryId === item._id}
                      />
                      <span className="z_slider"></span>
                    </label>
                    {/* <span
                      style={{
                        marginLeft: '10px',
                        color: item.active ? 'green' : 'red',
                        fontWeight: 500,
                        textTransform: 'capitalize',
                      }}
                    >
                      {item.active ? 'activated' : 'deactivated'}
                    </span> */}
                    {togglingCategoryId === item._id && (
                      <span style={{ marginLeft: '5px', fontSize: '12px', color: '#666' }}>
                        Updating...
                      </span>
                    )}
                  </td>
                  {isAdmin && (
                    <td className="z_catList_td">
                      <button
                        className="z_catList_actionBtn z_catList_editBtn"
                        title="Edit"
                        onClick={() => handleEdit(item._id)}
                      >
                        <RiEdit2Fill />
                      </button>
                      <button
                        className="z_catList_actionBtn z_catList_deleteBtn"
                        title="Delete"
                        onClick={() => openDeleteModal(item._id)}
                      >
                        <RiDeleteBin5Fill />
                      </button>
                    </td>
                  )}
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
              className={`z_pagin_btn${currentPage === idx + 1 ? " z_pagin_active" : ""
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="z_dltModal_overlay">
          <div className="z_dltModal_content z_dltModal_noRadius">
            {categoryToDelete && (
              <img
                src={categoryToDelete.image ? `http://localhost:5000/uploads/${categoryToDelete.image}` : "https://via.placeholder.com/50"}
                alt={categoryToDelete.name}
                className="z_dltModal_img"
              />
            )}
            <h2 className="z_dltModal_title">Delete Category</h2>
            <p className="z_dltModal_text">
              Are you sure you want to delete <b>{categoryToDelete?.name}</b>?
            </p>
            <div className="z_dltModal_btnGroup">
              <button className="z_dltModal_btn z_dltModal_cancel" onClick={closeDeleteModal}>
                Cancel
              </button>
              <button className="z_dltModal_btn z_dltModal_confirm" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CategoryList;
