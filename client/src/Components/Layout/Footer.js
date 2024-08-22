import React from "react";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <div className="footer bg-dark bg-gradient">
      <h1 className="text-center">All Right Reserved &copy; BuyBazaar</h1>
      <p className="text-center mt-3">
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/policy">Privacy Policy</Link>
      </p>
    </div>
  );
};

export default Footer;