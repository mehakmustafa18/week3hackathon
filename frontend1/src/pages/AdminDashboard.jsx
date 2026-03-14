import React, { useEffect, useState } from 'react';
import { adminAPI, orderAPI, productAPI } from '../api';
import { toast } from 'react-toastify';
import './AdminDashboard.css';

const StatCard = ({ label, value, icon }) => (
  <div className="stat-card">
    <div className="stat-card__icon">{icon}</div>
    <div>
      <p className="stat-card__value">{value}</p>
      <p className="stat-card__label">{label}</p>
    </div>
  </div>
);

const TABS = ['Overview', 'Products', 'Orders', 'Users'];
const CATEGORIES = ['Black Tea','Green Tea','White Tea','Matcha','Herbal Tea','Chai','Oolong','Rooibos','Teaware'];
const CAFFEINE_OPTIONS = ['No Caffeine','Low Caffeine','Medium Caffeine','High Caffeine'];

const emptyForm = {
  name: '', subtitle: '', description: '',
  category: 'Chai', caffeine: 'Medium Caffeine',
  origin: '', isOrganic: false, isVegan: false, isFeatured: false,
  flavor: '', qualities: '', allergens: '', images: '',
  steepingInstructions: { servingSize: '', waterTemp: '', steepingTime: '', colorAfter: '' },
  variants: [
    { size: '50g bag',  price: '', stock: '' },
    { size: '100g bag', price: '', stock: '' },
    { size: '175g bag', price: '', stock: '' },
    { size: '250g bag', price: '', stock: '' },
    { size: '1kg bag',  price: '', stock: '' },
    { size: 'Sampler',  price: '', stock: '' },
  ]
};

/* ── Product Form Modal ── */
const ProductFormModal = ({ editProduct, onClose, onSave }) => {
  const isEdit = !!editProduct;

  const [form, setForm] = useState(() => {
    if (isEdit) {
      return {
        ...editProduct,
        flavor:    editProduct.flavor?.join(', ')    || '',
        qualities: editProduct.qualities?.join(', ') || '',
        allergens: editProduct.allergens?.join(', ') || '',
        images:    editProduct.images?.[0]           || '',
        steepingInstructions: editProduct.steepingInstructions || { servingSize:'', waterTemp:'', steepingTime:'', colorAfter:'' },
        variants: editProduct.variants?.length
          ? editProduct.variants.map(v => ({ size: v.size, price: v.price, stock: v.stock }))
          : emptyForm.variants
      };
    }
    return { ...emptyForm, variants: emptyForm.variants.map(v => ({ ...v })) };
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSteeping = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, steepingInstructions: { ...prev.steepingInstructions, [name]: value } }));
  };

  const handleVariant = (index, field, value) => {
    setForm(prev => {
      const variants = [...prev.variants];
      variants[index] = { ...variants[index], [field]: value };
      return { ...prev, variants };
    });
  };

  const addVariant    = () => setForm(prev => ({ ...prev, variants: [...prev.variants, { size: '', price: '', stock: '' }] }));
  const removeVariant = (i) => setForm(prev => ({ ...prev, variants: prev.variants.filter((_, idx) => idx !== i) }));

  const handleSubmit = async () => {
    if (!form.name.trim())        { toast.error('Product name required'); return; }
    if (!form.description.trim()) { toast.error('Description required'); return; }

    const validVariants = form.variants.filter(v => v.size && v.price !== '' && v.stock !== '');
    if (!validVariants.length)    { toast.error('At least one complete variant required'); return; }

    setSaving(true);
    try {
      const payload = {
        name:        form.name.trim(),
        subtitle:    form.subtitle.trim(),
        description: form.description.trim(),
        category:    form.category,
        caffeine:    form.caffeine,
        origin:      form.origin.trim(),
        isOrganic:   form.isOrganic,
        isVegan:     form.isVegan,
        isFeatured:  form.isFeatured,
        images:      form.images.trim() ? [form.images.trim()] : [],
        flavor:      form.flavor.split(',').map(s => s.trim()).filter(Boolean),
        qualities:   form.qualities.split(',').map(s => s.trim()).filter(Boolean),
        allergens:   form.allergens.split(',').map(s => s.trim()).filter(Boolean),
        steepingInstructions: form.steepingInstructions,
        variants:    validVariants.map(v => ({ size: v.size, price: Number(v.price), stock: Number(v.stock) }))
      };

      if (isEdit) {
        await productAPI.update(editProduct._id, payload);
        toast.success('Product updated successfully!');
      } else {
        await productAPI.create(payload);
        toast.success('Product added successfully!');
      }
      onSave();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Basic Info */}
          <div className="form-section">
            <h3 className="form-section-title">Basic Information</h3>
            <div className="form-grid-2">
              <div className="form-field">
                <label>Product Name *</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Ceylon Ginger Chai Tea" />
              </div>
              <div className="form-field">
                <label>Category *</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="form-field">
              <label>Subtitle</label>
              <input name="subtitle" value={form.subtitle} onChange={handleChange} placeholder="A short tagline for the product" />
            </div>
            <div className="form-field">
              <label>Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Ingredients, details..." />
            </div>
            <div className="form-field">
              <label>Image Path</label>
              <input name="images" value={form.images} onChange={handleChange} placeholder="/assets/img/tea-1.jpg" />
              {form.images && (
                <img src={form.images} alt="preview" className="img-preview" onError={e => e.target.style.display='none'} />
              )}
            </div>
          </div>

          {/* Variants */}
          <div className="form-section">
            <div className="form-section-header">
              <h3 className="form-section-title">Variants</h3>
              <button className="admin-btn admin-btn--success" onClick={addVariant}>+ Add Row</button>
            </div>
            <div className="variants-table">
              <div className="variants-header">
                <span>Size / Name</span>
                <span>Price (€)</span>
                <span>Stock (qty)</span>
                <span></span>
              </div>
              {form.variants.map((v, i) => (
                <div key={i} className="variant-row">
                  <input value={v.size} placeholder="50g bag" onChange={e => handleVariant(i, 'size', e.target.value)} />
                  <input type="number" value={v.price} placeholder="3.90" min="0" step="0.01" onChange={e => handleVariant(i, 'price', e.target.value)} />
                  <input type="number" value={v.stock} placeholder="50" min="0" onChange={e => handleVariant(i, 'stock', e.target.value)} />
                  <button className="variant-remove" onClick={() => removeVariant(i)}>✕</button>
                </div>
              ))}
            </div>
          </div>

          {/* Tea Details */}
          <div className="form-section">
            <h3 className="form-section-title">Tea Details</h3>
            <div className="form-grid-2">
              <div className="form-field">
                <label>Caffeine Level</label>
                <select name="caffeine" value={form.caffeine} onChange={handleChange}>
                  {CAFFEINE_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label>Origin Country</label>
                <input name="origin" value={form.origin} onChange={handleChange} placeholder="Sri Lanka" />
              </div>
              <div className="form-field">
                <label>Flavor (comma separated)</label>
                <input name="flavor" value={form.flavor} onChange={handleChange} placeholder="Spicy, Earthy, Sweet" />
              </div>
              <div className="form-field">
                <label>Qualities (comma separated)</label>
                <input name="qualities" value={form.qualities} onChange={handleChange} placeholder="Stimulating, Warming" />
              </div>
            </div>
            <div className="form-field">
              <label>Allergens (comma separated)</label>
              <input name="allergens" value={form.allergens} onChange={handleChange} placeholder="Gluten Free, Dairy Free" />
            </div>
            <div className="form-checkboxes">
              <label className="checkbox-label">
                <input type="checkbox" name="isOrganic" checked={form.isOrganic} onChange={handleChange} />
                <span>Organic</span>
              </label>
              <label className="checkbox-label">
                <input type="checkbox" name="isVegan" checked={form.isVegan} onChange={handleChange} />
                <span>Vegan</span>
              </label>
              <label className="checkbox-label">
                <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} />
                <span>Featured on Home Page</span>
              </label>
            </div>
          </div>

          {/* Steeping */}
          <div className="form-section">
            <h3 className="form-section-title">Steeping Instructions</h3>
            <div className="form-grid-2">
              <div className="form-field">
                <label>Serving Size</label>
                <input name="servingSize" value={form.steepingInstructions.servingSize} onChange={handleSteeping} placeholder="2 tsp per cup" />
              </div>
              <div className="form-field">
                <label>Water Temperature</label>
                <input name="waterTemp" value={form.steepingInstructions.waterTemp} onChange={handleSteeping} placeholder="100°C" />
              </div>
              <div className="form-field">
                <label>Steeping Time</label>
                <input name="steepingTime" value={form.steepingInstructions.steepingTime} onChange={handleSteeping} placeholder="3-5 minutes" />
              </div>
              <div className="form-field">
                <label>Color After</label>
                <input name="colorAfter" value={form.steepingInstructions.colorAfter} onChange={handleSteeping} placeholder="3 minutes" />
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Main AdminDashboard ── */
const AdminDashboard = () => {
  const [tab, setTab]           = useState('Overview');
  const [stats, setStats]       = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders]     = useState([]);
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm]       = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes, usersRes, productsRes] = await Promise.all([
        adminAPI.getStats(),
        orderAPI.getAll({ limit: 50 }),
        adminAPI.getUsers(),
        productAPI.getAll({ limit: 50 })
      ]);
      setStats(statsRes.data);
      setOrders(ordersRes.data.orders);
      setUsers(usersRes.data.users);
      setProducts(productsRes.data.products);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const openAddForm  = () => { setEditProduct(null); setShowForm(true); };
  const openEditForm = (p)  => { setEditProduct(p);  setShowForm(true); };
  const closeForm    = ()   => { setShowForm(false); setEditProduct(null); };

  const handleBlockUser = async (userId) => {
    try {
      const { data } = await adminAPI.blockUser(userId);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, isBlocked: data.user.isBlocked } : u));
      toast.success(data.message);
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await orderAPI.updateStatus(orderId, status);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
      toast.success('Status updated');
    } catch (err) { toast.error('Error updating status'); }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Deactivate this product?')) return;
    try {
      await productAPI.remove(productId);
      setProducts(prev => prev.filter(p => p._id !== productId));
      toast.success('Product deactivated');
    } catch (err) { toast.error('Error'); }
  };

  if (loading) return <div className="admin-loader"><div className="spinner"/></div>;

  return (
    <div className="admin-dashboard">
      {showForm && <ProductFormModal editProduct={editProduct} onClose={closeForm} onSave={fetchAll} />}

      <div className="admin-dashboard__header">
        <h1>Dashboard</h1>
        <div className="admin-tabs">
          {TABS.map(t => (
            <button key={t} className={`admin-tab ${tab === t ? 'admin-tab--active' : ''}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>
      </div>

      {/* Overview */}
      {tab === 'Overview' && stats && (
        <div className="admin-overview">
          <div className="stats-grid">
            <StatCard label="Total Revenue" value={`€${stats.stats.totalRevenue.toFixed(2)}`}
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>} />
            <StatCard label="Total Orders" value={stats.stats.totalOrders}
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>} />
            <StatCard label="Total Users" value={stats.stats.totalUsers}
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>} />
            <StatCard label="Products" value={stats.stats.totalProducts}
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>} />
          </div>
          <div className="admin-section">
            <h2>Recent Orders</h2>
            <table className="admin-table">
              <thead><tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {(stats.recentOrders || []).map(o => (
                  <tr key={o._id}>
                    <td className="table-id">#{o._id.slice(-8).toUpperCase()}</td>
                    <td>{o.user?.name || '—'}</td>
                    <td>€{o.total.toFixed(2)}</td>
                    <td><span className={`status-badge status-badge--${o.status}`}>{o.status}</span></td>
                    <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Products */}
      {tab === 'Products' && (
        <div className="admin-section">
          <div className="admin-section__header">
            <h2>Products ({products.length})</h2>
            <button className="btn-primary" onClick={openAddForm} style={{ padding: '10px 24px', fontSize: '12px' }}>
              + Add Product
            </button>
          </div>
          <table className="admin-table">
            <thead><tr><th>Product</th><th>Category</th><th>Variants</th><th>Base Price</th><th>Featured</th><th>Actions</th></tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id}>
                  <td>
                    <div className="table-product">
                      <div className="table-product__img">
                        {p.images?.[0] && <img src={p.images[0]} alt={p.name} onError={e => e.target.style.display='none'} />}
                      </div>
                      <span>{p.name}</span>
                    </div>
                  </td>
                  <td>{p.category}</td>
                  <td>{p.variants?.length || 0}</td>
                  <td>€{p.variants?.[0]?.price?.toFixed(2) || '—'}</td>
                  <td>{p.isFeatured ? '✓' : '—'}</td>
                  <td>
                    <div style={{ display:'flex', gap:'8px' }}>
                      <button className="admin-btn admin-btn--edit" onClick={() => openEditForm(p)}>Edit</button>
                      <button className="admin-btn admin-btn--danger" onClick={() => handleDeleteProduct(p._id)}>Deactivate</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Orders */}
      {tab === 'Orders' && (
        <div className="admin-section">
          <h2>All Orders ({orders.length})</h2>
          <table className="admin-table">
            <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {orders.map(o => (
                <tr key={o._id}>
                  <td className="table-id">#{o._id.slice(-8).toUpperCase()}</td>
                  <td>{o.user?.name || '—'}<br/><span className="table-meta">{o.user?.email}</span></td>
                  <td>{o.items.length} item{o.items.length !== 1 ? 's' : ''}</td>
                  <td>€{o.total.toFixed(2)}</td>
                  <td>
                    <select value={o.status} onChange={e => handleStatusChange(o._id, e.target.value)} className={`status-select status-select--${o.status}`}>
                      {['pending','processing','shipped','delivered','cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Users */}
      {tab === 'Users' && (
        <div className="admin-section">
          <h2>All Users ({users.length})</h2>
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className={`role-badge role-badge--${u.role}`}>{u.role}</span></td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td><span className={`status-badge ${u.isBlocked ? 'status-badge--cancelled' : 'status-badge--delivered'}`}>{u.isBlocked ? 'Blocked' : 'Active'}</span></td>
                  <td>
                    <button className={`admin-btn ${u.isBlocked ? 'admin-btn--success' : 'admin-btn--danger'}`} onClick={() => handleBlockUser(u._id)}>
                      {u.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
