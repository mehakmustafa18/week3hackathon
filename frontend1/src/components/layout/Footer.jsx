import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer__inner container">
      <div className="footer__col">
        <h4>Collections</h4>
        <ul>
          {['Black Tea','Green Tea','White Tea','Herbal Tea','Matcha','Chai','Oolong','Rooibos','Teaware'].map(c => (
            <li key={c}><Link to={`/collections?category=${encodeURIComponent(c)}`}>{c}</Link></li>
          ))}
        </ul>
      </div>

      <div className="footer__col">
        <h4>Learn</h4>
        <ul>
          <li><Link to="/about">About us</Link></li>
          <li><Link to="/about">About our teas</Link></li>
          <li><Link to="/blog">Tea Academy</Link></li>
        </ul>
      </div>

      <div className="footer__col">
        <h4>Customer Service</h4>
        <ul>
          <li><Link to="/orders">Ordering and payment</Link></li>
          <li><Link to="/contact">Delivery</Link></li>
          <li><Link to="/contact">Privacy and policy</Link></li>
          <li><Link to="/contact">Terms &amp; Conditions</Link></li>
        </ul>
      </div>

      <div className="footer__col">
        <h4>Contact Us</h4>
        <ul className="footer__contact">
          <li>
            <img src="/assets/location_on.png" alt="Location Icon" />
            2 Palace, Palace St, Peakerton Ave, Shirley, Paris Prestonshire
          </li>
          <li>
             <img src="/assets/mail.png" alt="Email Icon" />
            Email: alianjara@gmail.com
          </li>
          <li>
            <img src="/assets/call.png" alt="Phone Icon" />
            Tel: +44 7972306040
          </li>
        </ul>
      </div>
    </div>

    <div className="footer__bottom">
      
    </div>
  </footer>
);

export default Footer;
