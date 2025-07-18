import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "../style/z_style.css";

function OrderView() {
  const { state } = useLocation();
  const order = state?.order;
  const navigate = useNavigate();
  const invoiceRef = useRef();

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

  const db_downloadInvoice = async () => {
    const input = invoiceRef.current;
    if (!input) return;
  
    input.style.display = "block";
  
    // Give browser a frame to apply style changes
    await new Promise((resolve) => requestAnimationFrame(resolve));
  
    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        scrollY: -window.scrollY,
        backgroundColor: "#fff"
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const marginTop = 5;    // top margin in mm (smaller)
      const marginSide = 15;  // left/right margin in mm (keep as before)
      const marginBottom = 15; // bottom margin in mm (keep as before)

      // Calculate image size inside margins
      const imgWidth = pdfWidth - 2 * marginSide;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Calculate the height of one PDF page in pixels (canvas scale)
      const pageHeightPx = (canvas.width / imgWidth) * (pdfHeight - marginTop - marginBottom);

      let renderedHeight = 0;
      let pageNum = 0;

      while (renderedHeight < canvas.height) {
        // Create a canvas for the current page
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = Math.min(pageHeightPx, canvas.height - renderedHeight);

        const ctx = pageCanvas.getContext("2d");
        // Draw the current page slice
        ctx.drawImage(
          canvas,
          0,
          renderedHeight,
          canvas.width,
          pageCanvas.height,
          0,
          0,
          canvas.width,
          pageCanvas.height
        );

        const imgData = pageCanvas.toDataURL("image/png");

        if (pageNum > 0) pdf.addPage();
        pdf.addImage(
          imgData,
          "PNG",
          marginSide,
          marginTop,
          imgWidth,
          (pageCanvas.height * imgWidth) / canvas.width
        );

        renderedHeight += pageHeightPx;
        pageNum++;
      }

      pdf.save(`Invoice_${order._id}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      input.style.display = "none";
    }
  };
  
  return (
    <div className="z_history_outerWrapper">
      <h2 className="z_history_title">Order Details</h2>

      <div className="z_history_cardWrapper">
        <div className="z_history_card z_history_card_modern">
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
                  <span className="z_history_value">#{order._id}</span>
                </div>
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

            <div
              className="z_history_invoiceLink z_history_invoiceLink_modern"
              onClick={db_downloadInvoice}
              style={{ cursor: "pointer", color: "#254D70" }}
            >
              Download Invoice
            </div>
          </div>

          {/* Products */}
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
                  </div>
                </div>
              ))
            ) : (
              <div className="z_history_noProducts">No products found.</div>
            )}
          </div>
        </div>
      </div>

      {/* PDF Hidden Invoice (Enhanced Professional Design) */}
      <div
        ref={invoiceRef}
        style={{
          display: "none",
          padding: "40px",
            paddingBottom: "120px", // Important: Add bottom padding
          background: "#ffffff",
          width: "850px",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          fontSize: "14px",
          color: "#333",
          lineHeight: "1.6",
          boxShadow: "0 0 20px rgba(0,0,0,0.1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            borderBottom: "4px solid #254D70",
            paddingBottom: "20px",
            marginBottom: "30px",
          }}
        >
          <h1
            style={{
              textAlign: "center",
              color: "#254D70",
              margin: "0",
              fontSize: "32px",
              fontWeight: "bold",
              letterSpacing: "1px",
            }}
          >
            INVOICE
          </h1>
          <div
            style={{
              textAlign: "center",
              color: "#666",
              fontSize: "16px",
              marginTop: "10px",
            }}
          >
            Tax Invoice / Bill of Supply / Cash Memo
          </div>
        </div>

        {/* Invoice Info Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "30px",
            background: "#f8f9fa",
            padding: "20px",
            borderRadius: "8px",
            border: "1px solid #e9ecef",
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: "15px" }}>
              <strong style={{ color: "#254D70", fontSize: "16px" }}>
                Invoice Details
              </strong>
            </div>
            <div style={{ marginBottom: "8px" }}>
              <span style={{ color: "#666", fontWeight: "500" }}>
                Invoice No:
              </span>
              <span style={{ marginLeft: "10px", fontWeight: "bold" }}>
                INV-{order._id.slice(-8)}
              </span>
            </div>
            <div style={{ marginBottom: "8px" }}>
              <span style={{ color: "#666", fontWeight: "500" }}>
                Order ID:
              </span>
              <span style={{ marginLeft: "10px", fontWeight: "bold" }}>
                {order._id}
              </span>
            </div>
            <div style={{ marginBottom: "8px" }}>
              <span style={{ color: "#666", fontWeight: "500" }}>
                Invoice Date:
              </span>
              <span style={{ marginLeft: "10px", fontWeight: "bold" }}>
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          <div style={{  textAlign: "right" }}>
            <div style={{ marginBottom: "15px" }}>
              <strong style={{ color: "#254D70", fontSize: "16px" }}>
                Order Status
              </strong>
            </div>
            <div
              style={{
                display: "flex",
                textAlign: "right",
                justifyContent: "end",
                alignItems: "center",
                width: "fit-content",
                padding: "8px 16px",
                paddingBottom:'20px',
                borderRadius: "20px",
                  background:
                    order.orderStatus === "delivered"
                      ? "#d4edda"
                      : order.orderStatus === "processing"
                      ? "#fff3cd"
                      : order.orderStatus === "shipped"
                      ? "#cce5ff"
                      : order.orderStatus === "pending"
                      ? "#ffeaa7"
                      : "#f8d7da",
                  color:
                    order.orderStatus === "delivered"
                      ? "#155724"
                      : order.orderStatus === "processing"
                      ? "#856404"
                      : order.orderStatus === "shipped"
                      ? "#004085"
                      : order.orderStatus === "pending"
                      ? "#b8860b"
                      : "#721c24",
                fontWeight: "bold",
                textTransform: "uppercase",
                fontSize: "12px",
                letterSpacing: "0.5px",
               
              }}
            >
              {order.orderStatus}
            </div>
          </div>
        </div>

        {/* Shipping and Payment Info */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              flex: 1,
              marginRight: "20px",
              padding: "20px",
              border: "1px solid #e9ecef",
              borderRadius: "8px",
              background: "#fafafa",
            }}
          >
            <div style={{ marginBottom: "15px" }}>
              <strong style={{ color: "#254D70", fontSize: "16px" }}>
                Shipping Address
              </strong>
            </div>
            <div style={{ color: "#555", lineHeight: "1.6" }}>
              {order.shippingAddress || "N/A"}
            </div>
          </div>

          <div
            style={{
              flex: 1,
              padding: "20px",
              border: "1px solid #e9ecef",
              borderRadius: "8px",
              background: "#fafafa",
            }}
          >
            <div style={{ marginBottom: "15px" }}>
              <strong style={{ color: "#254D70", fontSize: "16px" }}>
                Payment Information
              </strong>
            </div>
            <div style={{ marginBottom: "8px" }}>
              <span style={{ color: "#666", fontWeight: "500" }}>
                Payment Method:
              </span>
              <span style={{ marginLeft: "10px", fontWeight: "bold" }}>
                {order.paymentType || order.paymentMethod || "N/A"}
              </span>
            </div>
            <div style={{ marginBottom: "8px" }}>
              <span style={{ color: "#666", fontWeight: "500" }}>
                Payment Status:
              </span>
              <span
                style={{
                  marginLeft: "10px",
                  fontWeight: "bold",
                  color: order.paymentStatus === "paid" ? "#28a745" : "#dc3545",
                }}
              >
                {order.paymentStatus || "N/A"}
              </span>
            </div>
            <div>
              <span style={{ color: "#666", fontWeight: "500" }}>
                Delivery Date:
              </span>
              <span style={{ marginLeft: "10px", fontWeight: "bold" }}>
                {order.deliveryDate
                  ? new Date(order.deliveryDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "To be confirmed"}
              </span>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div style={{ marginBottom: "30px" }}>
          <h3
            style={{
              color: "#254D70",
              marginBottom: "15px",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            Order Items
          </h3>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <thead>
              <tr
                style={{
                  background:
                    "linear-gradient(135deg, #254D70 0%, #2c5d7a 100%)",
                  color: "#fff",
                }}
              >
                <th style={enhancedTh}>S.No</th>
                <th style={enhancedTh}>Image</th>
                <th style={enhancedTh}>Product Name</th>
                <th style={enhancedTh}>Unit Price</th>
                <th style={enhancedTh}>Quantity</th>
                <th style={enhancedTh}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {order.products.map((product, index) => (
                <tr
                  key={index}
                  style={{
                    background: index % 2 === 0 ? "#ffffff" : "#f8f9fa",
                    transition: "all 0.3s ease",
                  }}
                >
                  <td style={enhancedTd}>{index + 1}</td>
                  <td
                    style={{
                      ...enhancedTd,
                      textAlign: "center",
                      width: "80px",
                    }}
                  >
                    <img
                      src={
                        product.product_id.images &&
                        product.product_id.images.length > 0
                          ? `http://localhost:5000/uploads/${product.product_id.images[0]}`
                          : "https://via.placeholder.com/60x60?text=No+Image"
                      }
                      alt={product.product_id.name}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "2px solid #e9ecef",
                      }}
                    />
                  </td>
                  <td
                    style={{ ...enhancedTd, fontWeight: "500", color: "#333" }}
                  >
                    <div style={{ marginBottom: "5px" }}>
                      {product.product_id.name}
                    </div>
                    <div style={{ fontSize: "12px", color: "#666" }}>
                      Brand: {product.product_id.brand || "N/A"}
                    </div>
                  </td>
                  <td style={{ ...enhancedTd, textAlign: "right" }}>
                    ₹{product.priceAtOrder || product.product_id.price}
                  </td>
                  <td style={{ ...enhancedTd, textAlign: "center" }}>
                    {product.quantity}
                  </td>
                  <td
                    style={{
                      ...enhancedTd,
                      textAlign: "right",
                      fontWeight: "bold",
                    }}
                  >
                    ₹
                    {(
                      (product.priceAtOrder || product.product_id.price) *
                      product.quantity
                    ).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              width: "350px",
              border: "2px solid #254D70",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: "#254D70",
                color: "#fff",
                padding: "15px",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              Invoice Summary
            </div>
            <div style={{ padding: "20px", background: "#fff" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                  paddingBottom: "10px",
                  borderBottom: "1px solid #eee",
                }}
              >
                <span style={{ color: "#666" }}>Subtotal:</span>
                <span style={{ fontWeight: "bold" }}>₹{order.totalAmount}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                  paddingBottom: "10px",
                  borderBottom: "1px solid #eee",
                }}
              >
                <span style={{ color: "#666" }}>Shipping:</span>
                <span style={{ fontWeight: "bold", color: "#28a745" }}>
                  FREE
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                  paddingBottom: "10px",
                  borderBottom: "1px solid #eee",
                }}
              >
                <span style={{ color: "#666" }}>Tax:</span>
                <span style={{ fontWeight: "bold" }}>Included</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "15px 0",
                  borderTop: "2px solid #254D70",
                  marginTop: "10px",
                }}
              >
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#254D70",
                  }}
                >
                  Total Amount:
                </span>
                <span
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#254D70",
                  }}
                >
                  ₹{order.totalAmount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: "2px solid #254D70",
            paddingTop: "20px",
            textAlign: "center",
            color: "#666",
          }}
        >
          <p
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              color: "#254D70",
              marginBottom: "10px",
            }}
          >
            Thank you for shopping with us!
          </p>
          <p
            style={{
              fontSize: "12px",
              marginBottom: "5px",
            }}
          >
            This is a computer-generated invoice and does not require a
            signature.
          </p>
          <p
            style={{
              fontSize: "12px",
              color: "#888",
            }}
          >
            For any queries, please contact our customer support.
          </p>
        </div>
      </div>

      <button className="z_history_backBtn" onClick={() => navigate(-1)}>
        Back to Orders
      </button>
    </div>
  );
}

const enhancedTh = {
  padding: "15px 12px",
  textAlign: "left",
  fontWeight: "bold",
  fontSize: "14px",
  letterSpacing: "0.5px",
  textTransform: "uppercase",
  borderBottom: "2px solid #1a3d56"
};

const enhancedTd = {
  padding: "15px 12px",
  textAlign: "left",
  borderBottom: "1px solid #e9ecef",
  fontSize: "14px",
  color: "#555"
};

export default OrderView;