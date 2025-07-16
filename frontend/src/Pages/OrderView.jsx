import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../style/z_style.css";

function OrderView() {
  const { state } = useLocation();
  const order = state?.order;
  const navigate = useNavigate();

  if (!order) {
    return (
      <div className="z_history_container">
        <p>No order data found.</p>
        <button className="z_history_backBtn" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  // Helper for status badge
  const getStatusClass = (status) => {
    switch ((status || "").toLowerCase()) {
      case "delivered":
        return "z_history_status--delivered";
      case "processing":
        return "z_history_status--processing";
      case "shipped":
        return "z_history_status--shipped";
      case "cancelled":
        return "z_history_status--cancelled";
      default:
        return "z_history_status--default";
    }
  };

  return (
    <div className="z_history_outerWrapper">
      <h2 className="z_history_title">Order Details</h2>
      <div className="z_history_cardWrapper">
        <div className="z_history_card z_history_card_modern">
          {/* Left: Order summary */}
          <div className="z_history_summary z_history_summary_modern">
            <div
              className={`z_history_statusBadge ${getStatusClass(
                order.orderStatus
              )}`}
            >
              {order.orderStatus}
            </div>
            <div className="z_history_infoRow z_history_infoRow_modern">
              <div>
                <div className="z_history_label">
                  Order Number:{" "}
                  <span className="z_history_value">#{order._id}</span>{" "}
                </div>
                {/* <div className="z_history_value">#{order._id}</div> */}
              </div>
              <div>
                <div className="z_history_label">Order Date</div>
                <div className="z_history_value">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
                    : "-"}
                </div>
              </div>
            </div>
            <div className="z_history_infoRow z_history_infoRow_modern">
              <div>
                <div className="z_history_label">Delivery Date</div>
                <div className="z_history_value">
                  {order.deliveryDate
                    ? new Date(order.deliveryDate).toLocaleDateString()
                    : "-"}
                </div>
              </div>
              <div>
                <div className="z_history_label">Payment Method</div>
                <div className="z_history_value">
                  {order.paymentMethod || "N/A"}
                </div>
              </div>
            </div>
            <div className="z_history_infoRow z_history_infoRow_modern">
              <div>
                <div className="z_history_label">Ship To</div>
                <div className="z_history_value">
                  {order.shippingAddress || "N/A"}
                </div>
              </div>
            </div>
            <div className="z_history_totalRow z_history_totalRow_modern">
              <span className="z_history_totalLabel">Total Amount:</span>
              <span className="z_history_totalValue">₹{order.totalAmount}</span>
            </div>
            <a
              href="#"
              className="z_history_invoiceLink z_history_invoiceLink_modern"
            >
              Download Invoice
            </a>
          </div>
          {/* Right: Product details */}
          <div className="z_history_products z_history_products_modern">
            {order.products && order.products.length > 0 ? (
              order.products.map((product, idx) => (
                <div
                  className="z_history_productRow z_history_productRow_modern"
                  key={idx}
                >
                  <img
                    className="z_history_productImg z_history_productImg_modern"
                    src={
                      product.product_id.images
                        ? `http://localhost:5000/uploads/${product.product_id.images}`
                        : "https://via.placeholder.com/50"
                    }
                    alt={product.product_id.name}
                  />
                  <div className="z_history_productInfo z_history_productInfo_modern">
                    <div className="z_history_productName">
                      {product.product_id.name}
                    </div>
                    <div className="z_history_spacemng">
                      <div className="z_history_productPrice">
                        ₹{product.product_id.price}
                      </div>
                      <div className="z_history_productMeta">
                        <span>Qty: {product.quantity}</span>
                        {product.product_id.size && (
                          <span> | Size: {product.product_id.size}</span>
                        )}
                      </div>
                    </div>
                    {/* <a href="#" className="z_history_buyAgain">
                      Buy it again
                    </a> */}
                  </div>
                </div>
              ))
            ) : (
              <div className="z_history_noProducts">No products found.</div>
            )}
          </div>
        </div>
      </div>
      <button className="z_history_backBtn" onClick={() => navigate(-1)}>
        Back to Orders
      </button>
    </div>
  );
}

export default OrderView;
