import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productAPI } from '../api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './ProductDetail.css';

const VARIANT_IMAGES = {
  '50g bag':  '/assets/Group 27.png',
  '100g bag': '/assets/Group 27 (1).png',
  '175g bag': '/assets/Group.png',
  '250g bag': '/assets/Group 27 (2).png',
  '1kg bag':  '/assets/Group 27 (3).png',
  'Sampler':  '/assets/Group 24.png',
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, loading: cartLoading } = useCart();

  const [product, setProduct]         = useState(null);
  const [related, setRelated]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [selectedVariant, setSelected] = useState(null);
  const [quantity, setQuantity]       = useState(1);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      productAPI.getOne(id),
      productAPI.getRelated(id)
    ]).then(([prodRes, relRes]) => {
      setProduct(prodRes.data.product);
      setRelated(relRes.data.products);
      setSelected(prodRes.data.product.variants?.[0] || null);
    }).catch(() => navigate('/collections'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return; }
    if (!selectedVariant) { toast.error('Please select a size'); return; }

    const res = await addToCart(product._id, selectedVariant._id, quantity);
    if (res.success) {
      toast.success('Added to your bag!');
    } else {
      toast.error(res.message);
    }
  };

  if (loading) return <div className="product-detail__loader"><div className="spinner"/></div>;
  if (!product) return null;

  const inStock = selectedVariant ? selectedVariant.stock > 0 : false;
console.log('Variants:', product?.variants?.map(v => v.size));

  return (
    <div className="product-detail">
      {/* Breadcrumb */}
      <div className="product-detail__breadcrumb container">
        <Link to="/">Home</Link><span>/</span>
        <Link to="/collections">Collections</Link><span>/</span>
        <Link to={`/collections?category=${encodeURIComponent(product.category)}`}>{product.category}</Link><span>/</span>
        <span>{product.name}</span>
      </div>

      {/* Main */}
      <div className="product-detail__main container">
        {/* Image */}
        <div className="product-detail__image">
          <img
            src={product.images?.[0] || '/assets/placeholder.jpg'}
            alt={product.name}
          />
        </div>

        {/* Info */}
        <div className="product-detail__info">
          <h1 className="product-detail__name">{product.name}</h1>
          <p className="product-detail__subtitle">{product.subtitle}</p>

          {/* Badges */}
          <div className="product-detail__badges">
            {product.origin    && <span className="pd-badge"><span><img src="/assets/language.png" alt="" /></span> Organic: {product.origin}</span>}
            {product.isOrganic && <span className="pd-badge"><span><img src="/assets/redeem (1).png" alt="" /></span> Organic</span>}
            {product.isVegan   && <span className="pd-badge"><span><img src="/assets/eco.png" alt="" /></span> Vegan</span>}
          </div>

          {/* Price */}
          <div className="product-detail__price">
            €{(selectedVariant?.price || product.variants?.[0]?.price || 0).toFixed(2)}
          </div>

          {/* Variants */}
          <div className="product-detail__variants-label">Variants</div>
          <div className="product-detail__variants">
            {product.variants.map(v => (
              <button
  key={v._id}
  className={`variant-btn ${selectedVariant?._id === v._id ? 'variant-btn--active' : ''} ${v.stock === 0 ? 'variant-btn--oos' : ''}`}
  onClick={() => { if (v.stock > 0) setSelected(v); }}
  title={v.stock === 0 ? 'Out of stock' : v.size}
>
  <img 
    src={VARIANT_IMAGES[v.size] || '/assets/Group.png'} 
    alt={v.size}
    style={{ width: '28px', height: '28px', objectFit: 'cover' }}
  />
  <span>{v.size}</span>
</button>

            ))}
          </div>

          {/* Quantity + Add to cart */}
          <div className="product-detail__actions">
            <div className="product-detail__qty">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
              <span>{quantity}</span>
              <button onClick={() => {
                if (quantity < (selectedVariant?.stock || 1)) setQuantity(q => q + 1);
              }}>+</button>
            </div>
            <button
              className="btn-primary btn-fixed product-detail__add-btn"
              onClick={handleAddToCart}
              disabled={!inStock || cartLoading}
            >
              {!inStock ? 'Out of Stock' : cartLoading ? 'Adding...' : 'Add to Bag'}
            </button>
          </div>

          {selectedVariant && (
            <p className="product-detail__stock">
              {selectedVariant.stock > 0 ? `${selectedVariant.stock} in stock` : 'Out of stock'}
            </p>
          )}
        </div>
      </div>

      {/* ── Steeping Instructions + About ── */}
      <div className="product-detail__details container">
        {/* Steeping */}
        {product.steepingInstructions && (
          <div className="product-detail__steeping">
            <h2>Steeping instructions</h2>
            <div className="steeping-grid">
              <div className="steeping-item">
                <img src="/assets/Kettle.png" alt="" />
                <div>
                  <span className="steeping-label">Serving size</span>
                  <span className="steeping-value">{product.steepingInstructions.servingSize}</span>
                </div>
              </div>
              <div className="steeping-item">
                <img src="/assets/Water_voc.png" alt="" />
                <div>
                  <span className="steeping-label">Water temperature</span>
                  <span className="steeping-value">{product.steepingInstructions.waterTemp}</span>
                </div>
              </div>
              <div className="steeping-item">
                <img src="/assets/alarm.png" alt="" />
                <div>
                  <span className="steeping-label">Steeping time</span>
                  <span className="steeping-value">{product.steepingInstructions.steepingTime}</span>
                </div>
              </div>
              <div className="steeping-item steeping-item--color">
                <img src="/assets/Ellipse 2.png" alt="" />
                <div>
                  <span className="steeping-label">Color after</span>
                  <span className="steeping-value">{product.steepingInstructions.colorAfter}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* About */}
        <div className="product-detail__about">
          <h2>About this tea</h2>
          <div className="about-grid">
            {product.flavor?.length > 0 && (
              <div><span className="about-label">Flavor</span><span>{product.flavor.join(', ')}</span></div>
            )}
            {product.qualities?.length > 0 && (
              <div><span className="about-label">Qualities</span><span>{product.qualities.join(', ')}</span></div>
            )}
            {product.caffeine && (
              <div><span className="about-label">Caffeine</span><span>{product.caffeine}</span></div>
            )}
            {product.allergens?.length > 0 && (
              <div><span className="about-label">Allergens</span><span>{product.allergens.join(', ')}</span></div>
            )}
          </div>

          <h3>Ingredient</h3>
          <p className="about-description">{product.description}</p>
        </div>
      </div>

      {/* ── You may also like ── */}
      {related.length > 0 && (
        <div className="product-detail__related">
          <div className="container">
            <h2 className="section-title">You may also like</h2>
            <div className="related-grid">
              {related.map(p => (
                <Link to={`/product/${p._id}`} key={p._id} className="product-card">
                  <div className="product-card__img">
                    <img src={p.images?.[0] || '/assets/placeholder.jpg'} alt={p.name} />
                  </div>
                  <div className="product-card__info">
                    <p className="product-card__name">{p.name}</p>
                    <p className="product-card__price">€{p.variants?.[0]?.price?.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
