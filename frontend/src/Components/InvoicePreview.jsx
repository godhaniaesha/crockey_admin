import React from "react";

// Props: { order }
function InvoicePreview({ order }) {
  // Fallbacks for missing data
  const company = {
    name: "MONO",
    address: "",
    phone: "+91 456 789 888",
    email: "info@mono.com",
    website: "www.companyname.com",
  };
  const invoiceNo = order?._id || "12345678";
  const invoiceDate = order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-";
  const accountNo = order?.accountNo || "35544325";
  const customer = order?.customerName || order?.shippingAddress || "Customer Name";
  const items = order?.products || [];
  const paymentMethod = order?.paymentMethod || "N/A";
  const totalAmount = order?.totalAmount || 0;

  // Calculate totals
  const subTotal = items.reduce((sum, p) => sum + (p.product_id.price * p.quantity), 0);
  const tax = Math.round(subTotal * 0.10 * 100) / 100;
  const grandTotal = subTotal + tax;

  return (
    <div className="x_invoice_wrapper" style={{ maxWidth: 700, margin: "0 auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", padding: 32, fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", border: "3px solid #222", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 32, letterSpacing: 2 }}>
            MONO
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 600, fontSize: 28, letterSpacing: 2 }}>INVOICE</div>
          <div style={{ fontSize: 15, color: "#888", marginTop: 8 }}>Invoice No: <b>{invoiceNo}</b></div>
        </div>
      </div>
      {/* Invoice Info Row */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24, gap: 24 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Invoice To:</div>
          <div style={{ fontWeight: 500 }}>{customer}</div>
          <div style={{ fontSize: 14, color: "#555" }}>{company.address}</div>
          <div style={{ fontSize: 14, color: "#555" }}>Mobile: {company.phone}</div>
          <div style={{ fontSize: 14, color: "#555" }}>Email: {company.email}</div>
        </div>
        <div style={{ flex: 1, textAlign: "right" }}>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 24 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>Date</div>
              <div style={{ fontSize: 15 }}>{invoiceDate}</div>
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>Account No</div>
              <div style={{ fontSize: 15 }}>{accountNo}</div>
            </div>
          </div>
        </div>
      </div>
      {/* Table */}
      <table className="x_invoice_table" style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24 }}>
        <thead>
          <tr style={{ background: "#254d70", color: "#fff" }}>
            <th style={{ padding: 12, fontWeight: 600, fontSize: 15, textAlign: "left" }}>ITEM DESCRIPTION</th>
            <th style={{ padding: 12, fontWeight: 600, fontSize: 15 }}>UNIT PRICE</th>
            <th style={{ padding: 12, fontWeight: 600, fontSize: 15 }}>QTY</th>
            <th style={{ padding: 12, fontWeight: 600, fontSize: 15 }}>TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? items.map((p, idx) => (
            <tr key={idx} style={{ background: idx % 2 === 0 ? "#f8f9fa" : "#fff" }}>
              <td style={{ padding: 12, fontWeight: 500 }}>
                {p.product_id.name}
                <div style={{ fontSize: 13, color: "#888" }}>{p.product_id.description || "-"}</div>
              </td>
              <td style={{ padding: 12, textAlign: "center" }}>₹{p.product_id.price}</td>
              <td style={{ padding: 12, textAlign: "center" }}>{p.quantity}</td>
              <td style={{ padding: 12, textAlign: "center" }}>₹{p.product_id.price * p.quantity}</td>
            </tr>
          )) : (
            <tr><td colSpan={4} style={{ textAlign: "center", padding: 24 }}>No items found.</td></tr>
          )}
        </tbody>
      </table>
      {/* Totals */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <table style={{ minWidth: 320 }}>
          <tbody>
            <tr>
              <td style={{ padding: 6, fontWeight: 500 }}>Sub Total</td>
              <td style={{ padding: 6, textAlign: "right" }}>₹{subTotal}</td>
            </tr>
            <tr>
              <td style={{ padding: 6, fontWeight: 500 }}>Tax Vat 10%</td>
              <td style={{ padding: 6, textAlign: "right" }}>₹{tax}</td>
            </tr>
            <tr style={{ fontWeight: 700, fontSize: 18 }}>
              <td style={{ padding: 6, fontWeight: 700 }}>GRAND TOTAL</td>
              <td style={{ padding: 6, textAlign: "right", fontWeight: 700 }}>₹{grandTotal}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* Payment Methods */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>PAYMENT METHODS</div>
        <div style={{ fontSize: 14 }}>Paypal: <span style={{ color: "#254d70" }}>paypal@company.com</span> | Card Payment: Visa, Master Card | We accept Cheque</div>
      </div>
      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32 }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>{company.name}</div>
          <div style={{ fontSize: 13, color: "#888" }}>{company.address}</div>
          <div style={{ fontSize: 13, color: "#888" }}>{company.phone}</div>
          <div style={{ fontSize: 13, color: "#888" }}>{company.website}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 600, fontSize: 16 }}>THANK YOU FOR YOUR BUSINESS</div>
          <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>TERMS: Contrary to popular belief Lorem Ipsum not simply lorem ipsum dolor sit amet on the way...</div>
        </div>
      </div>
    </div>
  );
}

export default InvoicePreview; 