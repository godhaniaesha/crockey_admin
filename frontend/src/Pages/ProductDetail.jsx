import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductById, clearSingleProduct } from '../redux/slice/product.slice';
import { addOrUpdateProduct, fetchCarts } from '../redux/slice/cart.slice';
import '../style/d_style.css';
import { FaStar, FaRegStar, FaTruck, FaUndoAlt, FaTag, FaCheckCircle } from 'react-icons/fa';
import Spinner from "./Spinner";

function ProductDetail() {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('id');
  const dispatch = useDispatch();
  const { singleProduct, loading, error } = useSelector(state => state.product);
  const [mainImg, setMainImg] = useState('');
  const [activeTab, setActiveTab] = useState('Description');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (productId) {
      dispatch(getProductById(productId));
    }
    
    // Cleanup function to clear single product when component unmounts
    return () => {
      dispatch(clearSingleProduct());
    };
  }, [dispatch, productId]);

  useEffect(() => {
    if (singleProduct && singleProduct.images && singleProduct.images.length > 0) {
      setMainImg(`http://localhost:5000/uploads/${singleProduct.images[0]}`);
    }
  }, [singleProduct]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="pd-bg">
        <div className="pd-card">
          <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
            <h3>Error: {error}</h3>
          </div>
        </div>
      </div>
    );
  }

  if (!singleProduct) {
    return (
      <div className="pd-bg">
        <div className="pd-card">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <h3>Product not found</h3>
          </div>
        </div>
      </div>
    );
  }

  // Calculate discount price if discount exists
  const discountPrice = singleProduct.discount 
    ? singleProduct.price - (singleProduct.price * singleProduct.discount / 100)
    : singleProduct.price;

  // Process colors array
  const colorArray = Array.isArray(singleProduct.colors)
    ? (typeof singleProduct.colors[0] === 'string' && singleProduct.colors[0].includes(',') 
        ? singleProduct.colors[0].split(',').map(c => c.trim()) 
        : singleProduct.colors)
    : [];

  // Create color objects for display
  const colors = colorArray.map(color => ({
    name: color,
    code: color === "Transparent" ? "#ffffff" :
          color === "Ivory" ? "#fffff0" :
          color === "Cream" ? "#fffdd0" :
          color === "Beige" ? "#f5f5dc" :
          color === "Silver" ? "#c0c0c0" :
          color === "White" ? "#ffffff" :
          color === "Black" ? "#000000" : color
  }));

  // Generate highlights from product data
  const highlights = [
    singleProduct.brand && `Brand: ${singleProduct.brand}`,
    singleProduct.weight && `Weight: ${singleProduct.weight}`,
    singleProduct.pattern && `Pattern: ${singleProduct.pattern}`,
    singleProduct.active ? 'In Stock' : 'Out of Stock',
    'Premium Quality',
    'Durable Material'
  ].filter(Boolean);

  const handleAddToCart = async () => {
    if (!user) {
      alert('User not logged in');
      return;
    }
    if (!singleProduct) return;

    try {
      setAddingToCart(true);
      const data = {
        user_id: user._id,
        product_id: singleProduct._id,
        quantity: 1
      };
      await dispatch(addOrUpdateProduct(data)).unwrap();
      dispatch(fetchCarts());
      alert('Product added to cart!');
    } catch (error) {
      alert('Error adding to cart');
      console.error(error);
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="pd-bg">
      <div className="pd-card">
        <div className="pd-main-row">
          <div className="pd-img-col">
            <div className="pd-img-frame">
              <img src={mainImg} alt={singleProduct.name} className="pd-img" />
              <div className="pd-thumbs">
                {singleProduct.images && singleProduct.images.map((img, idx) => (
                  <button
                    key={img}
                    className={`pd-thumb${mainImg === `http://localhost:5000/uploads/${img}` ? ' pd-thumb-active' : ''}`}
                    onClick={() => setMainImg(`http://localhost:5000/uploads/${img}`)}
                    aria-label={`Show image ${idx + 1}`}
                  >
                    <img src={`http://localhost:5000/uploads/${img}`} alt={`Thumbnail ${idx + 1}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="pd-info-col">
            {/* SKU and Badges */}
            <div className='sm:justify-start justify-center' style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', marginBottom: 8, gap: 12 }}>
              <span style={{ color: '#6b7280', fontSize: 14 }}>SKU: {singleProduct._id}</span>
              {singleProduct.active && (
                <span style={{ display: 'flex', alignItems: 'center', background: '#e6eef5', color: '#254D70', borderRadius: 12, padding: '2px 10px', fontSize: 13, fontWeight: 600 }}>
                  <FaTag style={{ marginRight: 4, fontSize: 14 }} /> Active
                </span>
              )}
            </div>
            {/* Product Name */}
            <h1 className="pd-title">{singleProduct.name}</h1>
            {/* Price, Discount */}
            <div className="pd-price-row" style={{ alignItems: 'center', gap: 12 }}>
              <span className="pd-price">₹{discountPrice}</span>
              {singleProduct.discount && (
                <>
                  <span className="pd-oldprice">₹{singleProduct.price}</span>
                  <span className="pd-discount">({singleProduct.discount}% OFF)</span>
                </>
              )}
            </div>
            {/* Rating and Reviews */}
            <div className="pd-rating-row" style={{ alignItems: 'center', gap: 10 }}>yyyyy
              <span className="pd-rating" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <FaStar style={{ color: '#F1C40F', fontSize: 18, marginRight: 2 }} />
                4.5
              </span>
              <span className="pd-reviews" style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6b7280', fontSize: 14 }}>
                <FaRegStar style={{ fontSize: 15 }} />
                (0 reviews)
              </span>
            </div>
            {/* Key Highlights */}
            <ul className="pd-key-highlights" style={{ marginBottom: 10 }}>
              {highlights.slice(0, 3).map((h, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 15 }}>
                  <FaCheckCircle style={{ color: '#2ECC40', fontSize: 15 }} /> {h}
                </li>
              ))}
            </ul>
            {/* Meta Info */}
            <div className="pd-meta-row" style={{ gap: 10, fontSize: 15 }}>
              <span className="pd-category">{singleProduct.category_id?.name || 'Category'}</span>
              <span className="pd-brand">{singleProduct.brand || 'Brand'}</span>
              <span className={`pd-stock ${singleProduct.stock > 0 ? 'pd-instock' : 'pd-outstock'}`}>
                {singleProduct.stock > 0 ? `In Stock (${singleProduct.stock})` : 'Out of Stock'}
              </span>
            </div>
            {/* Add to Cart */}
            <div className='flex align-center justify-center'>
              <button
                className="pd-btn"
                style={{
                  marginTop: 18,
                  fontWeight: 700,
                  fontSize: 17,
                  display: 'flex',
                  padding: '12px 81px',
                  width: 'fit-content',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 2px 8px 0 #254D7033'
                }}
                onClick={handleAddToCart}
                disabled={addingToCart}
              >
                {addingToCart ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
        <div className="pd-tabs">
          <div className="pd-tab-list w-full" style={{ overflowX: 'auto' }}>
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
              <p style={{ fontSize: 16, lineHeight: 1.7 }}>
                {singleProduct.long_description || singleProduct.short_description || 'No description available.'}
              </p>
            )}
            {activeTab === 'Details' && (
              <div>
                {colors.length > 0 && (
                  <div className="pd-detail-row" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <b>Colors:</b> {colors.map(c => (
                      <span key={c.code} className="pd-color-dot" style={{ backgroundColor: c.code }} title={c.name}></span>
                    ))}
                  </div>
                )}
                {singleProduct.sizes && singleProduct.sizes.length > 0 && (
                  <div className="pd-detail-row">
                    <b>Sizes:</b> {singleProduct.sizes.join(', ')}
                  </div>
                )}
                <div className="pd-detail-row">
                  <b>Highlights:</b>
                  <ul className="pd-highlights">
                    {highlights.map((h, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <FaCheckCircle style={{ color: '#2ECC40', fontSize: 15 }} /> {h}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pd-detail-row" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FaTruck style={{ color: '#254D70', fontSize: 16 }} />
                  <b>Delivery:</b> Free delivery in 2-4 days
                </div>
                <div className="pd-detail-row" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FaUndoAlt style={{ color: '#254D70', fontSize: 16 }} />
                  <b className='text-nowrap'>Return Policy:</b> Easy 7-day return & exchange
                </div>
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