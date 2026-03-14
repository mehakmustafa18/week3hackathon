import React from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './CartSidebar.css';

const CartSidebar = () => {
  const { cart, cartOpen, setCartOpen, updateQuantity, removeItem, cartTotal } = useCart();
  const navigate = useNavigate();

  const handlePurchase = () => {
    setCartOpen(false);
    navigate('/cart');
  };

  if (!cartOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={() => setCartOpen(false)} />
      <div className="cart-sidebar">
        <div className="cart-sidebar__header">
          <h3>My Bag</h3>
          <button className="cart-sidebar__close" onClick={() => setCartOpen(false)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="cart-sidebar__items">
          {!cart?.items?.length ? (
            <div className="cart-sidebar__empty">
              <p>Your bag is empty</p>
              <button className="btn-secondary" onClick={() => { setCartOpen(false); navigate('/collections'); }}>
                Shop Now
              </button>
            </div>
          ) : (
            cart.items.map(item => (
              <div key={item._id} className="cart-sidebar__item">
                <div className="cart-sidebar__item-img">
                  {item.product?.images?.[0]
                    ? <img src={item.product.images[0]} alt={item.product.name} />
                    : <div className="cart-sidebar__img-placeholder" />
                  }
                </div>
                <div className="cart-sidebar__item-info">
                  <p className="cart-sidebar__item-name">{item.product?.name}</p>
                  <p className="cart-sidebar__item-size">{item.variantSize}</p>
                  <div className="cart-sidebar__item-row">
                    <div className="cart-sidebar__qty">
                      <button onClick={() => item.quantity > 1 && updateQuantity(item._id, item.quantity - 1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                    </div>
                    <button className="cart-sidebar__remove" onClick={() => removeItem(item._id)}>
                      REMOVE
                    </button>
                  </div>
                </div>
                <span className="cart-sidebar__item-price">
                  €{(item.variantPrice * item.quantity).toFixed(2)}
                </span>
              </div>
            ))
          )}
        </div>

        {cart?.items?.length > 0 && (
          <div className="cart-sidebar__footer">
            <div className="cart-sidebar__summary">
              <div className="cart-sidebar__row">
                <span>Subtotal</span>
                <span>€{cartTotal.toFixed(2)}</span>
              </div>
              <div className="cart-sidebar__row">
                <span>Delivery</span>
                <span>€1.95</span>
              </div>
              <div className="cart-sidebar__row cart-sidebar__total">
                <span>Total</span>
                <span>€{(cartTotal + 1.95).toFixed(2)}</span>
              </div>
            </div>
            <button className="btn-primary cart-sidebar__purchase" onClick={handlePurchase}>
              Purchase
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
