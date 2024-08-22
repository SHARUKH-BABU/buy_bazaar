import React from "react";
import Layout from "../Components/Layout/Layout";

const Policy = () => {
  return (
    <Layout title={"Privacy Policy - BuyBazaar"}>
      <div className="row contactus">
        <div className="col-md-4">
          <img
            src="/images/privacyPolicy.jpeg"
            alt="Privacy Policy"
            height={400}
            width={500}
            className="rounded-circle"
          />
        </div>
        <div className="col-md-8 h-80 overflow-auto p-5">
          <h2>Privacy Policy</h2>
          <p>At BuyBazaar, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website or use our services.</p>
          
          <h5>1. Information We Collect</h5>
          <p>We may collect personal information such as your name, email address, phone number, and payment information when you make a purchase or sign up for our newsletter. We also collect non-personal information such as your browsing behavior and usage patterns to improve our services.</p>

          <h5>2. How We Use Your Information</h5>
          <p>Your information is used to process transactions, communicate with you about your orders, and provide you with relevant updates and promotions. We may also use your information to improve our website and services.</p>

          <h5>3. Data Security</h5>
          <p>We employ industry-standard security measures to protect your information from unauthorized access, alteration, or disclosure. However, no system can be completely secure, so we cannot guarantee absolute protection.</p>

        </div>
      </div>
    </Layout>
  );
};

export default Policy;
