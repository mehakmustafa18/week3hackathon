import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../api';
import { toast } from 'react-toastify';
import './CartPage.css';

const STEPS = ['My Bag', 'Delivery', 'Review & Payment'];

const PAYMENT_ICONS = [
  { name: 'Visa',       img: '/assets/images/icons/Visa.png' },
  { name: 'Mastercard', img: '/assets/images/icons/mastercard-dark-large.png' },
  { name: 'Maestro',    img: '/assets/images/icons/maestro-dark-large (1).png' },
  { name: 'Group 30',   img: '/assets/images/icons/Group 30.png' },
  { name: 'Group 29',   img: '/assets/images/icons/Group 29.png' },
];
/* ─── Step 1: My Bag ─── */
const BagStep = ({ cart, cartTotal, updateQuantity, removeItem, onNext }) => (
  <div className="cart-step">
    <div className="cart-step__items">
      {cart.items.length === 0 ? (
        <div className="cart-empty">
          <p>Your bag is empty</p>
          <Link to="/collections" className="btn-secondary">Continue Shopping</Link>
        </div>
      ) : (
        cart.items.map(item => (
          <div key={item._id} className="cart-item">
            <div className="cart-item__img">
              {item.product?.images?.[0]
                ? <img src={item.product.images[0]} alt={item.product.name} />
                : <div className="cart-item__img-placeholder" />
              }
            </div>
            <div className="cart-item__info">
              <p className="cart-item__name">{item.product?.name}</p>
              <p className="cart-item__size">{item.variantSize}</p>
              <div className="cart-item__controls">
                <div className="cart-item__qty">
                  <button onClick={() => item.quantity > 1 && updateQuantity(item._id, item.quantity - 1)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                </div>
                <button className="cart-item__remove" onClick={() => removeItem(item._id)}>REMOVE</button>
              </div>
            </div>
            <span className="cart-item__price">€{(item.variantPrice * item.quantity).toFixed(2)}</span>
          </div>
        ))
      )}
    </div>

    {cart.items.length > 0 && (
      <>
        <div className="cart-subtotal">
          <span>Subtotal</span>
          <span>€{cartTotal.toFixed(2)}</span>
        </div>
        <div className="cart-step__actions">
          <Link to="/collections" className="btn-secondary">Back to Shopping</Link>
          <button className="btn-primary" onClick={onNext}>Continue to Delivery</button>
        </div>
      </>
    )}
  </div>
);

/* ─── Step 2: Delivery ─── */
const DeliveryStep = ({ address, setAddress, onNext, onPrev }) => {
  const handleChange = e => setAddress(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = () => {
    const { street, city, country, postalCode } = address;
    if (!street || !city || !country || !postalCode) {
      toast.error('Please fill all delivery fields');
      return;
    }
    onNext();
  };

  return (
    <div className="cart-step">
      <div className="delivery-form">
        <div className="form-row">
          <div className="form-field">
            <label>Street Address</label>
            <input name="street" value={address.street} onChange={handleChange} placeholder="123 Main Street" />
          </div>
        </div>
        <div className="form-row form-row--2">
          <div className="form-field">
            <label>City</label>
            <input name="city" value={address.city} onChange={handleChange} placeholder="London" />
          </div>
          <div className="form-field">
            <label>Postal Code</label>
            <input name="postalCode" value={address.postalCode} onChange={handleChange} placeholder="SW1A 1AA" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label>Country</label>
            <input name="country" value={address.country} onChange={handleChange} placeholder="United Kingdom" />
          </div>
        </div>
      </div>
      <div className="cart-step__actions">
        <button className="btn-secondary" onClick={onPrev}>← Back</button>
        <button className="btn-primary" onClick={handleSubmit}>Continue to Payment</button>
      </div>
    </div>
  );
};

/* ─── Step 3: Review & Payment ─── */
const ReviewStep = ({ cart, cartTotal, address, onPrev, onPlaceOrder, placing }) => (
  <div className="cart-step">
    <div className="review-address">
      <h4>Delivery to</h4>
      <p>{address.street}, {address.city}, {address.postalCode}, {address.country}</p>
    </div>
    <div className="cart-step__items">
      {cart.items.map(item => (
        <div key={item._id} className="cart-item cart-item--compact">
          <div className="cart-item__img">
            {item.product?.images?.[0]
              ? <img src={item.product.images[0]} alt={item.product.name} />
              : <div className="cart-item__img-placeholder" />
            }
          </div>
          <div className="cart-item__info">
            <p className="cart-item__name">{item.product?.name} — {item.variantSize}</p>
            <p className="cart-item__size">Qty: {item.quantity}</p>
          </div>
          <span className="cart-item__price">€{(item.variantPrice * item.quantity).toFixed(2)}</span>
        </div>
      ))}
    </div>
    <div className="cart-step__actions">
      <button className="btn-secondary" onClick={onPrev}>← Back</button>
      <button className="btn-primary" onClick={onPlaceOrder} disabled={placing}>
        {placing ? 'Placing Order...' : 'Place Order'}
      </button>
    </div>
  </div>
);

/* ─── Main CartPage ─── */
const CartPage = () => {
  const { cart, cartTotal, updateQuantity, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep]     = useState(0);
  const [placing, setPlacing] = useState(false);
  const [address, setAddress] = useState({
    street: '', city: '', postalCode: '', country: ''
  });

  const DELIVERY = 1.95;
  const total = cartTotal + DELIVERY;

  const handlePlaceOrder = async () => {
    if (!user) { navigate('/login'); return; }
    setPlacing(true);
    try {
      const { data } = await orderAPI.place({ shippingAddress: address, paymentMethod: 'card' });
      toast.success('Order placed successfully!');
      navigate(`/orders/${data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="cart-page">
      <div className="cart-page__inner container">
        {/* Left side */}
        <div className="cart-page__left">
          {/* Step indicator */}
          <div className="cart-stepper">
            {STEPS.map((s, i) => (
              <React.Fragment key={s}>
                <span className={`cart-stepper__step ${i === step ? 'cart-stepper__step--active' : ''} ${i < step ? 'cart-stepper__step--done' : ''}`}>
                  {i + 1}. {s}
                </span>
                {i < STEPS.length - 1 && <span className="cart-stepper__sep">—</span>}
              </React.Fragment>
            ))}
          </div>

          {step === 0 && (
            <BagStep
              cart={cart} cartTotal={cartTotal}
              updateQuantity={updateQuantity} removeItem={removeItem}
              onNext={() => setStep(1)}
            />
          )}
          {step === 1 && (
            <DeliveryStep
              address={address} setAddress={setAddress}
              onNext={() => setStep(2)} onPrev={() => setStep(0)}
            />
          )}
          {step === 2 && (
            <ReviewStep
              cart={cart} cartTotal={cartTotal} address={address}
              onPrev={() => setStep(1)} onPlaceOrder={handlePlaceOrder} placing={placing}
            />
          )}
        </div>

        {/* Right: Order Summary */}
        <div className="cart-page__right">
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="order-summary__rows">
              <div className="order-summary__row">
                <span>Subtotal</span>
                <span>€{cartTotal.toFixed(2)}</span>
              </div>
              <div className="order-summary__row">
                <span>Delivery</span>
                <span>€{DELIVERY.toFixed(2)}</span>
              </div>
              <div className="order-summary__row order-summary__total">
                <span>Total</span>
                <span>€{total.toFixed(2)}</span>
              </div>
            </div>
            <div className="order-summary__shipping-note">
              <img src="/assets/images/icons/local_shipping.png" alt="Shipping" style={{ width: '22px', height: '22px', marginRight: '8px' }} />
              <span>Estimated shipping time: 2 days</span>
            </div>

            {step === 0 && cart.items.length > 0 && (
              <button className="btn-primary order-summary__checkout" onClick={() => setStep(1)}>
                Check Out
              </button>
            )}

            {/* Payment icons */}
            <div className="order-summary__payment">
              <h4>Payment type</h4>
              <div className="payment-icons">
                {PAYMENT_ICONS.map(p => (
                  <div key={p.name} className="payment-icon">
                    <img 
                      src={p.img} 
                      alt={p.name}
                      style={{ width: '40px', height: '26px', objectFit: 'contain' }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="order-summary__trust-badges">
              <div className="trust-badge">
                <img src="/assets/images/icons/Group.png" alt="Secure" style={{ width: '18px' }} />
                <span>Secure Checkout</span>
              </div>
              <div className="trust-badge">
                <img src="/assets/images/icons/eco.png" alt="Eco" style={{ width: '18px' }} />
                <span>Eco Friendly</span>
              </div>
            </div>

            {/* Delivery info */}
            <div className="order-summary__delivery-info">
              <h4>Delivery and retour</h4>
              <ul>
                <li>Order before 12:00 and we will ship the same day.</li>
                <li>Orders made after Friday 12:00 are processed on Monday.</li>
                <li>To return your articles, please contact us first.</li>
                <li>Postal charges for return are not reimbursed.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Popular this season */}
      <PopularSection />
    </div>
  );
};

/* ─── Popular this season (bottom of cart page) ─── */
const PopularSection = () => {
  const [products, setProducts] = React.useState([]);
  React.useEffect(() => {
    import('../api').then(({ productAPI }) => {
      productAPI.getFeatured().then(r => setProducts(r.data.products.slice(0, 3))).catch(() => {});
    });
  }, []);

  if (!products.length) return null;

  return (
    <div className="cart-popular">
      <div className="container">
        <h2 className="section-title">Popular this season</h2>
        <div className="cart-popular__grid">
          {products.map(p => (
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
  );
};

export default CartPage;