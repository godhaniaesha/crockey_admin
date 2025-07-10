import React, { useState } from 'react';
import '../style/d_style.css';
import { FaStar, FaRegStar, FaTruck, FaUndoAlt, FaTag, FaCheckCircle } from 'react-icons/fa';

const dummyProduct = {
  name: 'Elegant Ceramic Plate',
  price: 299,
  discountPrice: 249,
  description: 'This elegant ceramic plate is perfect for serving your favorite dishes. Crafted with high-quality materials, it is both durable and stylish, making it a great addition to any kitchen or dining room. The unique matte finish and premium feel make it a must-have for every home chef.',
  category: 'Crockery',
  brand: "Levi's",
  sku: 'PLT-2024-ELG',
  images: [
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=600&q=80',
  ],
  colors: [
    { name: 'Blue', code: '#254D70' },
    { name: 'Red', code: '#E63946' },
    { name: 'Yellow', code: '#F1C40F' },
    { name: 'Green', code: '#2ECC40' },
  ],
  sizes: ['6 inch', '8 inch', '10 inch', '12 inch'],
  stock: 12,
  highlights: [
    'Premium ceramic material',
    'Microwave & dishwasher safe',
    'Elegant matte finish',
    'Scratch-resistant',
    'Lead-free & eco-friendly', 
    'Handcrafted design',
  ],
  rating: 4.7,
  reviews: 54,
  badges: ['Best Seller', 'New Arrival'],
  delivery: 'Free delivery in 2-4 days',
  returnPolicy: 'Easy 7-day return & exchange',
};

function ProductDetail() {
  const [mainImg, setMainImg] = useState(dummyProduct.images[0]);
  const [activeTab, setActiveTab] = useState('Description');

  return (
    <div className="pd-bg">
      <div className="pd-card">
        <div className="pd-main-row">
          <div className="pd-img-col">
            <div className="pd-img-frame">
              <img src={mainImg} alt={dummyProduct.name} className="pd-img" />
              <div className="pd-thumbs">
                {dummyProduct.images.map((img, idx) => (
                  <button
                    key={img}
                    className={`pd-thumb${mainImg === img ? ' pd-thumb-active' : ''}`}
                    onClick={() => setMainImg(img)}
                    aria-label={`Show image ${idx + 1}`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="pd-info-col">
            {/* SKU and Badges */}
            <div className='sm:justify-start justify-center' style={{ display: 'flex', alignItems: 'center',flexWrap:'wrap', marginBottom: 8, gap: 12 }}>
              <span style={{ color: '#6b7280', fontSize: 14 }}>SKU: {dummyProduct.sku}</span>
              {dummyProduct.badges.map((badge, i) => (
                <span key={badge} style={{ display: 'flex', alignItems: 'center', background: '#e6eef5', color: '#254D70', borderRadius: 12, padding: '2px 10px', fontSize: 13, fontWeight: 600, marginLeft: i === 0 ? 12 : 6 }}>
                  <FaTag style={{ marginRight: 4, fontSize: 14 }} /> {badge}
                </span>
              ))}
            </div>
            {/* Product Name */}
            <h1 className="pd-title">{dummyProduct.name}</h1>
            {/* Price, Discount */}
            <div className="pd-price-row" style={{ alignItems: 'center', gap: 12 }}>
              <span className="pd-price">₹{dummyProduct.discountPrice}</span>
              <span className="pd-oldprice">₹{dummyProduct.price}</span>
              <span className="pd-discount">({Math.round(100 - (dummyProduct.discountPrice / dummyProduct.price) * 100)}% OFF)</span>
            </div>
            {/* Rating and Reviews */}
            <div className="pd-rating-row" style={{ alignItems: 'center', gap: 10 }}>
              <span className="pd-rating" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <FaStar style={{ color: '#F1C40F', fontSize: 18, marginRight: 2 }} />
                {dummyProduct.rating}
              </span>
              <span className="pd-reviews" style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6b7280', fontSize: 14 }}>
                <FaRegStar style={{ fontSize: 15 }} />
                ({dummyProduct.reviews} reviews)
              </span>
            </div>
            {/* Key Highlights */}
            <ul className="pd-key-highlights" style={{ marginBottom: 10 }}>
              {dummyProduct.highlights.slice(0, 3).map((h, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 15 }}>
                  <FaCheckCircle style={{ color: '#2ECC40', fontSize: 15 }} /> {h}
                </li>
              ))}
            </ul>
            {/* Meta Info */}
            <div className="pd-meta-row" style={{ gap: 10, fontSize: 15 }}>
              <span className="pd-category">{dummyProduct.category}</span>
              <span className="pd-brand">{dummyProduct.brand}</span>
              <span className={`pd-stock ${dummyProduct.stock > 0 ? 'pd-instock' : 'pd-outstock'}`}>{dummyProduct.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
            </div>
            {/* Add to Cart */}
         <div className='flex align-center justify-center'>
         <button className="pd-btn " style={{ marginTop: 18, fontWeight: 700, fontSize: 17, display: 'flex',padding:'12px 81px', width:'fit-content', alignItems: 'center',justifyContent:'center', gap: 8, boxShadow: '0 2px 8px 0 #254D7033' }}>
              
              Add to Cart
            </button>
         </div>
          </div>
        </div>
        <div className="pd-tabs">
          <div className="pd-tab-list w-full" style={{overflowX:'auto'}}>
            {['Description', 'Details', 'Reviews'].map(tab => (
              <button
                key={tab}
                className={`pd-tab${activeTab === tab ? ' pd-tab-active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="pd-tab-panel">
            {activeTab === 'Description' && (
              <p style={{ fontSize: 16, lineHeight: 1.7 }}>{dummyProduct.description}</p>
            )}
            {activeTab === 'Details' && (
              <div>
                <div className="pd-detail-row" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><b>Colors:</b> {dummyProduct.colors.map(c => <span key={c.code} className="pd-color-dot" style={{ backgroundColor: c.code }} title={c.name}></span>)}</div>
                <div className="pd-detail-row"><b>Sizes:</b> {dummyProduct.sizes.join(', ')}</div>
                <div className="pd-detail-row"><b>Highlights:</b>
                  <ul className="pd-highlights">{dummyProduct.highlights.map((h, i) => <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}><FaCheckCircle style={{ color: '#2ECC40', fontSize: 15 }} /> {h}</li>)}</ul>
                </div>
                <div className="pd-detail-row" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FaTruck style={{ color: '#254D70', fontSize: 16 }} /><b>Delivery:</b> {dummyProduct.delivery}</div>
                <div className="pd-detail-row" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FaUndoAlt style={{ color: '#254D70', fontSize: 16 }} /><b>Return Policy:</b> {dummyProduct.returnPolicy}</div>
              </div>
            )}
            {activeTab === 'Reviews' && (
              <div style={{ color: '#6b7280', fontSize: 15, padding: 10 }}>No reviews yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;