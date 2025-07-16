import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, deleteOrder } from "../redux/slice/order.slice";
import "../style/z_style.css";
import { RiDeleteBin5Fill, RiEdit2Fill, RiEyeFill } from "react-icons/ri";
import { GrCaretNext, GrCaretPrevious } from "react-icons/gr";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 10;

function OrderList() {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.order);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // Filter and paginate
  const filteredData = orders.filter((order) => {
    const customer = order.user_id?.username || order.user_id?.email || "";
    const orderStatus = order.orderStatus || "";
    return (
      order._id.toLowerCase().includes(search.toLowerCase()) ||
      customer.toLowerCase().includes(search.toLowerCase()) ||
      orderStatus.toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleDelete = (id) => {
    dispatch(deleteOrder(id));
  };

  const handleView = (order) => {
    navigate("/singleOrder", { state: { order } });
  };

  if (loading) return <Spinner />;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="z_odrHis_container">
      <div className="z_odrHis_manage_content">
        <h3 className="z_odrHis_title">Order History</h3>
        <div className="z_odrHis_topbar">
          <div className="z_odrHis_searchWrapper">
            <input
              className="z_odrHis_search"
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
            <span className="z_odrHis_searchIcon">
              {/* SVG search icon */}
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <circle cx="9" cy="9" r="7" stroke="#254d70" strokeWidth="2" />
                <line
                  x1="14.5"
                  y1="14.5"
                  x2="19"
                  y2="19"
                  stroke="#254d70"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
      <div className="z_odrHis_tableWrapper">
        <table className="z_odrHis_table">
          <thead>
            <tr className="z_odrHis_tr">
              <th className="z_odrHis_th">Order Id</th>
              <th className="z_odrHis_th">Created At</th>
              <th className="z_odrHis_th">Customer</th>
              <th className="z_odrHis_th">Items</th>
              <th className="z_odrHis_th">Total</th>
              <th className="z_odrHis_th">Payment Status</th>
              <th className="z_odrHis_th">Order Status</th>
              <th className="z_odrHis_th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((order) => (
              <tr className="z_odrHis_tr" key={order._id}>
                <td className="z_odrHis_td">{order._id}</td>
                <td className="z_odrHis_td">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
                <td className="z_odrHis_td">
                  {order.user_id?.username || order.user_id?.email || "N/A"}
                </td>
                <td className="z_odrHis_td">
                  {order.products?.reduce(
                    (sum, p) => sum + (p.quantity || 0),
                    0
                  )}
                </td>
                <td className="z_odrHis_td">₹{order.totalAmount}</td>
                <td className="z_odrHis_td">
                  <span
                    className={`z_odrHis_paymentBadge z_odrHis_payment--${order.paymentStatus}`}
                  >
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="z_odrHis_td">
                  <span
                    className={`z_odrHis_statusBadge z_odrHis_status--${order.orderStatus}`}
                  >
                    {order.orderStatus}
                  </span>
                </td>
                <td className="z_odrHis_td">
                  <button
                    className="z_odrHis_actionBtn z_odrHis_editBtn"
                    title="Edit"
                  >
                    <RiEdit2Fill />
                  </button>
                  <button
                    className="z_odrHis_actionBtn z_odrHis_deleteBtn"
                    title="Delete"
                    onClick={() => handleDelete(order._id)}
                  >
                    <RiDeleteBin5Fill />
                  </button>
                  <button
                    className="z_odrHis_actionBtn z_odrHis_viewBtn"
                    title="View"
                    onClick={() => handleView(order)}
                  >
                    <RiEyeFill />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
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
              className={`z_pagin_btn${currentPage === idx + 1 ? " z_pagin_active" : ""}`}
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
      )}
    </div>
  );
}

export default OrderList;
