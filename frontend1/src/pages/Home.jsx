import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../api';
import './Home.css';

const COLLECTIONS = [
  { name: 'Black Tea',  img: '/assets/black-tea.png',   slug: 'Black Tea' },
  { name: 'Green Tea',  img: '/assets/green-tea.png',   slug: 'Green Tea' },
  { name: 'White Tea',  img: '/assets/white-tea.png',   slug: 'White Tea' },
  { name: 'Matcha',     img: '/assets/matcha.png',      slug: 'Matcha' },
  { name: 'Herbal Tea', img: '/assets/herbal-tea.png',  slug: 'Herbal Tea' },
  { name: 'Chai',       img: '/assets/chai-tea.png',    slug: 'Chai' },
  { name: 'Oolong',     img: '/assets/oolong.png',      slug: 'Oolong' },
  { name: 'Rooibos',    img: '/assets/rooibos.png',     slug: 'Rooibos' },
  { name: 'Teaware',    img: '/assets/teaware.png',     slug: 'Teaware' },
];

const BADGES = [
  { icon: '/assets/local_cafe.png', text: '450+ kinds of looseleaf tea' },
  { icon: '/assets/redeem.png', text: 'Certificated organic teas' },
  { icon: '/assets/local_shipping.png', text: 'Free delivery' },
  { icon: '/assets/sell.png', text: 'Sample for all teas' },
];

const Home = () => {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    productAPI.getFeatured()
      .then(res => setFeatured(res.data.products))
      .catch(() => {});
  }, []);

  return (
    <div className="home">
      {/* ── Hero ── */}
      <section className="home__hero">
        <div className="home__hero-img">
          <img src="/assets/hero-bg.png" alt="Loose leaf teas on spoons" />
        </div>
        <div className="home__hero-text">
          <h1>Every day is unique,<br />just like our tea</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur. Orci nullam adipiscing quis libero
            tempus ullamcorper. Lorem ipsum dolor sit amet consectetur.
          </p>
          <p>
            Lorem ipsum dolor sit amet adipiscing quis. Orci nullam adipiscing quis.
            Risque facilis iatin eris.
          </p>
          <Link to="/collections" className="btn-primary">Browse Teas</Link>
        </div>
      </section>

      {/* ── Trust badges ── */}
      <section className="home__badges">
        <div className="container">
          <div className="home__badges-grid">
            {BADGES.map((b, i) => (
              <div key={i} className="home__badge">
                   <img src={b.icon} alt={b.text} className="home__badge-icon"/>
                  <span>{b.text}</span>
              </div>
            ))}
          </div>
          <div className="home__badges-cta">
            <Link to="/about" className="btn-secondary">Learn More</Link>
          </div>
        </div>
      </section>

      {/* ── Our Collections ── */}
      <section className="home__collections">
        <div className="container">
          <h2 className="section-title">Our Collections</h2>
          <div className="home__collections-grid">
            {COLLECTIONS.map(col => (
              <Link
                to={`/collections?category=${encodeURIComponent(col.slug)}`}
                key={col.slug}
                className="home__collection-card"
              >
                <div className="home__collection-img">
                  <img src={col.img} alt={col.name} />
                </div>
                <p>{col.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
