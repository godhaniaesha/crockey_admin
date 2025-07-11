import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubcategories, updateSubcategory, deleteSubcategory } from "../redux/slice/subcat.slice.jsx";
import "../style/z_style.css";
import { RiDeleteBin5Fill, RiEdit2Fill, RiSearchLine } from "react-icons/ri";
import { GrCaretNext, GrCaretPrevious } from "react-icons/gr";
import { useNavigate, useParams } from "react-router-dom";

const ITEMS_PER_PAGE = 10;

function SubcategoryList(props) {
  const dispatch = useDispatch();
  const { subcategories = [], loading = false, error = null } = useSelector(state => state.subcategory) || {};
  const [currentPage, setCurrentPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState(null);

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const confirmDelete = async () => {
    await dispatch(deleteSubcategory(deleteId));
    closeDeleteModal();
  };

  useEffect(() => {
    dispatch(fetchSubcategories());
  }, [dispatch]);

  // Always use the array for rendering
  const safeSubcategories = Array.isArray(subcategories) ? subcategories : [];

  const filteredData = safeSubcategories.filter(
    (item) =>
      item.category_name?.toLowerCase().includes(search.toLowerCase()) ||
      item.subcategory_details?.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleStatusToggle = (id) => {
    // TODO: Implement status toggle functionality with API call
    console.log("Toggle status for subcategory ID:", id);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (loading) {
    return <div className="z_subcat_container">Loading subcategories...</div>;
  }
  if (error) {
    return <div className="z_subcat_container">Error: {error}</div>;
  }

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
              <tr className="z_subcat_tr" key={item._id || item.subcat_id}>
                <td className="z_subcat_td">{item._id || item.subcat_id}</td>
                <td className="z_subcat_td">{item.category_name || item.category_id?.name}</td>
                <td className="z_subcat_td">
                  <div className="z_subcat_details_cell">
                    <img
                      src={item.image ? `http://localhost:5000/uploads/${item.image}` : item.img || "https://via.placeholder.com/50"}
                      alt={item.subcategory_details}
                      className="z_subcat_img"
                    />
                    <span className="z_subcat_name">{item.name}</span>
                  </div>
                </td>
                <td className="z_subcat_td">{item.description}</td>
                <td className="z_subcat_td">
                  <label className="z_subcat_switch">
                    <input
                      type="checkbox"
                      checked={item.status || false}
                      onChange={() => handleStatusToggle(item._id || item.subcat_id)}
                    />
                    <span className="z_subcat_slider"></span>
                  </label>
                </td>
                <td className="z_subcat_td">
                  <button
                    className="z_subcat_actionBtn z_subcat_editBtn"
                    title="Edit"
                    onClick={() => navigate(`/edit-subcategory/${item._id || item.subcat_id}`)}
                  >
                    <RiEdit2Fill />
                  </button>
                  <button
                    className="z_subcat_actionBtn z_subcat_deleteBtn"
                    title="Delete"
                    onClick={() => openDeleteModal(item._id || item.subcat_id)}
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
      {showDeleteModal && (
        <div className="z_dltModal_overlay">
          <div className="z_dltModal_content z_dltModal_noRadius">
            {deleteId && (() => {
              const subcat = safeSubcategories.find(sc => sc._id === deleteId || sc.subcat_id === deleteId);
              return subcat ? (
                <img
                  src={subcat.image ? `http://localhost:5000/uploads/${subcat.image}` : "https://via.placeholder.com/50"}
                  alt={subcat.name}
                  className="z_dltModal_img"
                />
              ) : null;
            })()}
            <h2 className="z_dltModal_title">Delete Subcategory</h2>
            <p className="z_dltModal_text">
              Are you sure you want to delete <b>{safeSubcategories.find(sc => sc._id === deleteId || sc.subcat_id === deleteId)?.name}</b>?
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
    </div>
  );
}

export default SubcategoryList;