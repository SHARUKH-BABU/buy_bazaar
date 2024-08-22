import React from "react";
import Layout from "../Components/Layout/Layout";
import { BiMailSend, BiPhoneCall, BiSupport } from "react-icons/bi";
const Contact = () => {
  return (
    <Layout title={"Contact us - BuyBazaar"}>
      <div className="row contactus ">
        <div className="col-md-6">
          <img
            src="/images/contactUs.jpeg"
            alt="contactus"
            height={400}
            width={400}   
            className="rounded-circle"
          />
        </div>
        <div className="col-md-4">
          <h1 className="bg-dark p-2 text-white text-center">CONTACT US</h1>
          <p className="text-justify mt-2">
            any query and info about prodduct feel free to call anytime we 24X7
            vaialible
          </p>
          <p className="mt-3">
            <BiMailSend /> : sharukhbabushaik@gmail.com
          </p>
          <p className="mt-3">
            <BiPhoneCall /> : 91-6301270325
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;