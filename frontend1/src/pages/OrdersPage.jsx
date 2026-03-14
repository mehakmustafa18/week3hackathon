import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { orderAPI } from '../api';
import './OrdersPage.css';

const STATUS_COLORS = {
  pending:    { bg: '#fef9e7', color: '#b7950b' },
  processing: { bg: '#eaf4fb', color: '#1a6fa8' },
  shipped:    { bg: '#eaf5ea', color: '#1e8449' },
  delivered:  { bg: '#eaf5ea', color: '#1e8449' },
  cancelled:  { bg: '#fdf2f2', color: '#c0392b' },
};

/* ── Order History ── */
export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getMyOrders()
      .then(r => setOrders(r.data.orders))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="orders-loader"><div className="spinner"/></div>;

  return (
    <div className="orders-page container">
      <h1 className="orders-title">My Orders</h1>

      {orders.length === 0 ? (
        <div className="orders-empty">
          <p>You haven't placed any orders yet.</p>
          <Link to="/collections" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <Link to={`/orders/${order._id}`} key={order._id} className="order-card">
              <div className="order-card__header">
                <div>
                  <span className="order-card__label">Order</span>
                  <span className="order-card__id">#{order._id.slice(-8).toUpperCase()}</span>
                </div>
                <span
                  className="order-card__status"
                  style={STATUS_COLORS[order.status]}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>

              <div className="order-card__items">
                {order.items.slice(0, 2).map((item, i) => (
                  <span key={i} className="order-card__item">
                    {item.name} ({item.variantSize}) × {item.quantity}
                  </span>
                ))}
                {order.items.length > 2 && (
                  <span className="order-card__item">+{order.items.length - 2} more</span>
                )}
              </div>

              <div className="order-card__footer">
                <span className="order-card__date">
                  {new Date(order.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </span>
                <span className="order-card__total">€{order.total.toFixed(2)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Order Detail ── */
export const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getOne(id)
      .then(r => setOrder(r.data.order))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="orders-loader"><div className="spinner"/></div>;
  if (!order)  return <div className="orders-page container"><p>Order not found.</p></div>;

  const statusStyle = STATUS_COLORS[order.status] || {};

  return (
    <div className="order-detail container">
      <div className="order-detail__header">
        <Link to="/orders" className="order-detail__back">← Back to Orders</Link>
        <div className="order-detail__title">
          <h1>Order #{order._id.slice(-8).toUpperCase()}</h1>
          <span className="order-card__status" style={statusStyle}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>
        <p className="order-detail__date">
          Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
          })}
        </p>
      </div>

      <div className="order-detail__body">
        {/* Items */}
        <div className="order-detail__items">
          <h2>Items</h2>
          {order.items.map((item, i) => (
            <div key={i} className="order-detail__item">
              <div className="order-detail__item-img">
                {item.image
                  ? <img src={item.image} alt={item.name} />
                  : <div className="cart-item__img-placeholder" />
                }
              </div>
              <div className="order-detail__item-info">
                <p className="order-detail__item-name">{item.name}</p>
                <p className="order-detail__item-meta">{item.variantSize} · Qty: {item.quantity}</p>
              </div>
              <span className="order-detail__item-price">
                €{(item.variantPrice * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Summary + Shipping */}
        <div className="order-detail__sidebar">
          <div className="order-detail__summary">
            <h2>Order Summary</h2>
            <div className="order-summary__rows">
              <div className="order-summary__row"><span>Subtotal</span><span>€{order.subtotal.toFixed(2)}</span></div>
              <div className="order-summary__row"><span>Delivery</span><span>€{order.deliveryCharge.toFixed(2)}</span></div>
              <div className="order-summary__row order-summary__total"><span>Total</span><span>€{order.total.toFixed(2)}</span></div>
            </div>
          </div>

          <div className="order-detail__shipping">
            <h2>Shipping Address</h2>
            <p>{order.shippingAddress.street}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
            <p>{order.shippingAddress.country}</p>
          </div>

          {/* Status tracker */}
          <div className="order-detail__tracker">
            <h2>Tracking</h2>
            <div className="tracker">
              {['pending','processing','shipped','delivered'].map((s, i) => {
                const statuses = ['pending','processing','shipped','delivered'];
                const currentIdx = statuses.indexOf(order.status);
                const isDone    = i <= currentIdx;
                const isActive  = i === currentIdx;
                return (
                  <div key={s} className={`tracker__step ${isDone ? 'tracker__step--done' : ''} ${isActive ? 'tracker__step--active' : ''}`}>
                    <div className="tracker__dot"/>
                    {i < 3 && <div className="tracker__line"/>}
                    <span>{s.charAt(0).toUpperCase() + s.slice(1)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
