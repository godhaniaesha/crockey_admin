import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCoupons, deleteCoupon, updateCoupon } from "../redux/slice/coupon.slice";
import "../style/z_style.css";
import { RiDeleteBin5Fill, RiEdit2Fill, RiCoupon3Line } from "react-icons/ri";
import { GrCaretNext, GrCaretPrevious } from "react-icons/gr";
import { BiSolidCoupon } from "react-icons/bi";
import Spinner from "./Spinner";


const ITEMS_PER_PAGE = 10;

// Simple Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6';
  
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: bgColor,
      color: 'white',
      padding: '12px 20px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 9999,
      maxWidth: '300px',
      wordWrap: 'break-word'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>{message}</span>
        <button 
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            marginLeft: '10px',
            fontSize: '18px'
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
};

function CouponList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { coupons = [], loading = false, error = null } = useSelector(state => state.coupon) || {};
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });

  useEffect(() => {
    const loadCoupons = async () => {
      try {
        const result = await dispatch(fetchCoupons());
        if (fetchCoupons.rejected.match(result)) {
          setToast({
            show: true,
            message: 'Failed to load coupons. Please try again.',
            type: 'error'
          });
        }
      } catch (error) {
        setToast({
          show: true,
          message: 'Error loading coupons: ' + (error.message || 'Unknown error'),
          type: 'error'
        });
      }
    };

    loadCoupons();
  }, [dispatch]);

  // Show error toast when error state changes
  useEffect(() => {
    if (error) {
      setToast({
        show: true,
        message: error,
        type: 'error'
      });
    }
  }, [error]);

  // Support both array and {result: array} API responses
  const safeCoupons = Array.isArray(coupons?.result)
    ? coupons.result
    : Array.isArray(coupons)
    ? coupons
    : [];

  const handleDelete = async (id) => {
    try {
      const result = await dispatch(deleteCoupon(id));
      if (deleteCoupon.fulfilled.match(result)) {
        setToast({
          show: true,
          message: 'Coupon deleted successfully!',
          type: 'success'
        });
      } else if (deleteCoupon.rejected.match(result)) {
        setToast({
          show: true,
          message: 'Failed to delete coupon. Please try again.',
          type: 'error'
        });
      }
    } catch (error) {
      setToast({
        show: true,
        message: 'Error deleting coupon: ' + (error.message || 'Unknown error'),
        type: 'error'
      });
    }
  };

  const filteredData = safeCoupons.filter(
    (item) =>
      item.code?.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleStatusToggle = async (id) => {
    const coupon = safeCoupons.find(c => (c._id || c.id) === id);
    if (!coupon) return;

    try {
      const result = await dispatch(updateCoupon({
        id,
        couponData: { ...coupon, active: !coupon.active }
      }));

      if (updateCoupon.rejected.match(result)) {
        setToast({
          show: true,
          message: 'Failed to update status. Please try again.',
          type: 'error'
        });
      }
    } catch (error) {
      setToast({
        show: true,
        message: 'Error updating status: ' + (error.message || 'Unknown error'),
        type: 'error'
      });
    }
  };

  const handleEdit = (id) => {
    navigate(`/coupons/edit/${id}`);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const closeToast = () => {
    setToast({ show: false, message: '', type: 'error' });
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="z_coupon_container">
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={closeToast} 
        />
      )}
      
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
              <th className="z_coupon_th">Description</th>
              <th className="z_coupon_th">Expires At</th>
              <th className="z_coupon_th">Status</th>
              <th className="z_coupon_th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr className="z_coupon_tr">
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                  {error ? 'Error loading coupons' : 'No coupons found'}
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => (
                <tr className="z_coupon_tr" key={item._id || item.id}>
                  <td className="z_coupon_td">
                    <div className="z_coupon_details_cell">
                      <div className="z_coupon_img_placeholder">
                        <BiSolidCoupon style={{ fontSize: '24px', color: '#254d70' }} />
                      </div>
                      <span className="z_coupon_name">{item.code}</span>
                    </div>
                  </td>
                  <td className="z_coupon_td">{item.discount}%</td>
                  <td className="z_coupon_td">
                    <span style={{ 
                      background: '#e6eef5', 
                      color: '#254d70', 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {item.code}
                    </span>
                  </td>
                  <td className="z_coupon_td">{
                    item.description
                      ? item.description.length > 60
                        ? item.description.slice(0, 60) + '...'
                        : item.description
                      : "No description"
                  }</td>
                  <td className="z_coupon_td">{formatDate(item.expiresAt)}</td>
                  <td className="z_coupon_td">
                    <label className="z_coupon_switch">
                      <input
                        type="checkbox"
                        checked={item.active || false}
                        onChange={() => handleStatusToggle(item._id || item.id)}
                      />
                      <span className="z_coupon_slider"></span>
                    </label>
                  </td>
                  <td className="z_coupon_td">
                    <button
                      className="z_coupon_actionBtn z_coupon_editBtn"
                      title="Edit"
                      onClick={() => handleEdit(item._id || item.id)}
                    >
                      <RiEdit2Fill />
                    </button>
                    <button
                      className="z_coupon_actionBtn z_coupon_deleteBtn"
                      title="Delete"
                      onClick={() => handleDelete(item._id || item.id)}
                    >
                      <RiDeleteBin5Fill />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
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
      )}
    </div>
  );
}

export default CouponList;