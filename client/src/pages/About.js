import React from "react";
import Layout from "../Components/Layout/Layout";

const About = () => {
  return (
    <Layout title={"About us - BuyBazaar"}>
      <div className="row contactus bg-info bg-opacity-10">
        <div className="col-md-6 ">
          <img
            src="images/aboutUs.png"
            alt="contactus"
            style={{ width: "100%" }}
           height={400}
            width={200}
            className="rounded-circle"
          />
        </div>
        <div className="col-md-4">
          <p className="text-justify mt-2">
            Welcome to our e-commerce platform, where we are dedicated to providing a seamless and secure shopping experience. Our mission is to offer high-quality products at affordable prices while ensuring that your payment transactions are safe and reliable.
            <br />
            <br />
            <h1>
              Why Choose Us?
            </h1>
            <ul>
              <li>Quality Products</li>
              <li>Secure Payment</li>
              <li>Fast Delivery</li>
              <li>24/7 Customer Support</li>
            </ul>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;