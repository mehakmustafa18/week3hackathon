import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productAPI } from '../api';
import './ProductList.css';

/* ── Filter config matching Figma ── */
const FILTER_CONFIG = {
  Collections: ['Black Tea','Green Tea','White Tea','Herbal Tea','Matcha','Chai','Oolong','Rooibos','Teaware'],
  Origin:      ['India','Japan','China','Taiwan','Sri Lanka','South Africa','Egypt','Morocco'],
  Flavour:     ['Spicy','Earthy','Sweet','Grassy','Floral','Citrus','Minty','Umami','Vanilla','Fruity','Cool','Fresh','Honey'],
  Qualities:   ['Stimulating','Calming','Refreshing','Digestive','Antioxidant','Energising','Soothing','Warming'],
  Caffeine:    ['No Caffeine','Low Caffeine','Medium Caffeine','High Caffeine'],
  Allergens:   ['Gluten Free','Dairy Free','Nut Free','Soy Free'],
};

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest' },
  { value: 'price_asc',  label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Top Rated' },
];

/* ── Single product card ── */
const ProductCard = ({ product }) => {
  const basePrice = product.variants?.[0]?.price || 0;
  return (
    <Link to={`/product/${product._id}`} className="product-card">
      <div className="product-card__img">
        <img
          src={product.images?.[0] || '/assets/placeholder.jpg'}
          alt={product.name}
        />
      </div>
      <div className="product-card__info">
        <p className="product-card__name">{product.name}</p>
        {/* <p className="product-card__subtitle">{product.subtitle}</p> */}
        <p className="product-card__price">€{basePrice.toFixed(2)}</p>
      </div>
    </Link>
  );
};

/* ── Collapsible filter section ── */
const FilterSection = ({ title, items, selected, onChange, isOrganic, onOrganicChange }) => {
  const [open, setOpen] = useState(true);

  if (title === 'organic') {
    return (
      <div className="filter-section">
        <div className="filter-section__header" onClick={() => setOpen(!open)}>
          <span>Organic</span>
          <span style={{ fontSize: '18px', fontWeight: '700', lineHeight: 1 }}>
            {open ? '−' : '+'}
          </span>
        </div>
        {open && (
          <div className="filter-section__body">
            <label className="filter-toggle">
              <span>Organic only</span>
              <div className={`toggle ${isOrganic ? 'toggle--on' : ''}`} onClick={onOrganicChange}>
                <div className="toggle__knob"/>
              </div>
            </label>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="filter-section">
      <div className="filter-section__header" onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <span className="filter-section__count">{items.length}</span>
        <span style={{ fontSize: '18px', fontWeight: '300', lineHeight: 1 }}>
          {open ? '−' : '+'}
        </span>
      </div>
      {open && (
        <div className="filter-section__body">
          {items.map(item => (
            <label key={item} className="filter-checkbox">
              <input
                type="checkbox"
                checked={selected.includes(item)}
                onChange={() => onChange(item)}
              />
              <span className="filter-checkbox__box"/>
              <span className="filter-checkbox__label">{item}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Build filters from URL params
  const [filters, setFilters] = useState({
    category:  searchParams.get('category')  ? [searchParams.get('category')] : [],
    origin:    [],
    flavor:    [],
    qualities: [],
    caffeine:  [],
    allergens: [],
    isOrganic: false,
  });
  const [sort, setSort]               = useState('newest');
  const [products, setProducts]       = useState([]);
  const [pagination, setPagination]   = useState({});
  const [loading, setLoading]         = useState(false);
  const [page, setPage]               = useState(1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 9,
        sort,
        ...(filters.category.length  && { category: filters.category.join(',') }),
        ...(filters.origin.length    && { origin:   filters.origin.join(',') }),
        ...(filters.flavor.length    && { flavor:   filters.flavor.join(',') }),
        ...(filters.qualities.length && { qualities: filters.qualities.join(',') }),
        ...(filters.caffeine.length  && { caffeine: filters.caffeine.join(',') }),
        ...(filters.isOrganic        && { isOrganic: true }),
        ...(searchParams.get('search') && { search: searchParams.get('search') }),
      };
      const { data } = await productAPI.getAll(params);
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters, sort, page, searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const toggleFilter = (key, value) => {
    setPage(1);
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(v => v !== value)
        : [...prev[key], value]
    }));
  };

  const toggleOrganic = () => {
    setPage(1);
    setFilters(prev => ({ ...prev, isOrganic: !prev.isOrganic }));
  };

  const clearAll = () => {
    setPage(1);
    setFilters({ category:[], origin:[], flavor:[], qualities:[], caffeine:[], allergens:[], isOrganic: false });
  };

  // Breadcrumb
  const activeCat = filters.category[0] || 'All';

  return (
    <div className="product-list-page">
      {/* Hero banner */}
      <div className="product-list__banner">
        <img src="/assets/images/collections-hero.png" alt="Tea collections" />
      </div>

      {/* Breadcrumb */}
      <div className="product-list__breadcrumb container">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/collections">Collections</Link>
        {filters.category[0] && <><span>/</span><span>{filters.category[0]}</span></>}
      </div>

      <div className="product-list__body container">
        {/* ── Sidebar Filters ── */}
        <aside className="product-list__sidebar">
          <div className="product-list__sidebar-header">
            <span className="sidebar-title">Filters</span>
            <button className="sidebar-clear" onClick={clearAll}>Clear All</button>
          </div>

          <FilterSection title="Collections" items={FILTER_CONFIG.Collections}
            selected={filters.category} onChange={v => toggleFilter('category', v)} />
          <FilterSection title="Origin" items={FILTER_CONFIG.Origin}
            selected={filters.origin} onChange={v => toggleFilter('origin', v)} />
          <FilterSection title="Flavour" items={FILTER_CONFIG.Flavour}
            selected={filters.flavor} onChange={v => toggleFilter('flavor', v)} />
          <FilterSection title="Qualities" items={FILTER_CONFIG.Qualities}
            selected={filters.qualities} onChange={v => toggleFilter('qualities', v)} />
          <FilterSection title="Caffeine" items={FILTER_CONFIG.Caffeine}
            selected={filters.caffeine} onChange={v => toggleFilter('caffeine', v)} />
          <FilterSection title="Allergens" items={FILTER_CONFIG.Allergens}
            selected={filters.allergens} onChange={v => toggleFilter('allergens', v)} />
          <FilterSection title="organic" isOrganic={filters.isOrganic} onOrganicChange={toggleOrganic} />
        </aside>

        {/* ── Products Area ── */}
        <div className="product-list__main">
          {/* Sort bar */}
          <div className="product-list__sort-bar">
            <span className="product-list__count">
              {pagination.total || 0} products
            </span>
            <div className="product-list__sort">
              <span>Sort by</span>
              <select value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}>
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="product-list__loading">
              <div className="spinner"/>
            </div>
          ) : products.length === 0 ? (
            <div className="product-list__empty">
              <p>No products found. Try adjusting your filters.</p>
              <button className="btn-secondary" onClick={clearAll}>Clear Filters</button>
            </div>
          ) : (
            <div className="product-list__grid">
              {products.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="product-list__pagination">
              <button
                disabled={!pagination.hasPrevPage}
                onClick={() => setPage(p => p - 1)}
                className="pagination-btn"
              >
                ← Prev
              </button>

              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  className={`pagination-btn ${n === page ? 'pagination-btn--active' : ''}`}
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              ))}

              <button
                disabled={!pagination.hasNextPage}
                onClick={() => setPage(p => p + 1)}
                className="pagination-btn"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
