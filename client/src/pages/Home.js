
// bg-success p-2 text-white bg-opacity-75
// bg-info bg-opacity-75
// bg-warning bg-opacity-75
// bg-danger bg-opacity-75
// bg-primary bg-opacity-75
// bg-secondary bg-opacity-75

import React, { useState, useEffect } from "react";
import Layout from "../Components/Layout/Layout";
import axios from "axios";
import { Checkbox, Radio, Spin, Button } from "antd";
import Prices from "../Components/Prices";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [ cart, setCart ] = useCart();

  const navigator = useNavigate();

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  useEffect(() => {
    if (!checked.length && !radio.length) {
      getAllProducts();
    }
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) {
      filterProduct();
    }
  }, [checked, radio]);

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getAllProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/v1/product/get-product`);
      setProducts(data?.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTotal = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/product-count");
      setTotal(data?.total);
    } catch (error) {
      console.error("Error fetching total count:", error);
    }
  };

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setProducts((prevProducts) => [...prevProducts, ...data?.products]);
    } catch (error) {
      console.error("Error loading more products:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const filterProduct = async () => {
    try {
      const { data } = await axios.post("/api/v1/product/product-filters", {
        checked,
        radio,
      });
      setProducts(data?.products);
    } catch (error) {
      console.error("Error filtering products:", error);
    }
  };

  const handleFilter = (value, id) => {
    setChecked((prev) =>
      value ? [...prev, id] : prev.filter((c) => c !== id)
    );
  };

  const handleResetFilters = () => {
    setChecked([]);
    setRadio([]);
    getAllProducts();
  };

  return (
    <Layout title={"All Products - Best offers"}>
      <div className="container-fluid row bg-info bg-opacity-10 p-4">
      <div className=" bg-info bg-opacity-25 rounded p-3 col-md-3 p-2">
          <h4 className="text-center mb-4">Filter By Category</h4>
          <div className="d-flex flex-column">
            {categories?.map((c) => (
              <Checkbox
                key={c._id}
                onChange={(e) => handleFilter(e.target.checked, c._id)}
                className="mb-2"
              >
                {c.name}
              </Checkbox>
            ))}
          </div>
          <hr />
          <h4 className="text-center mt-4 mb-4">Filter By Price</h4>
          <div className="d-flex flex-column">
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {Prices?.map((p) => (
                <Radio key={p._id} value={p.array} className="mb-2">
                  {p.name}
                </Radio>
              ))}
            </Radio.Group>
          </div>

          <Button
            type="primary"
            danger
            onClick={handleResetFilters}
            className="w-100 mb-2 mt-2"
          >
            RESET FILTERS
          </Button>
        </div>


        <div className="col-md-9">
          <h1 className="text-center">All Products</h1>
          {loading ? (
            <div className="text-center"><Spin /></div>
          ) : (
            <div className="d-flex flex-wrap">
              {products?.map((p) => (
                <div className="card m-2" style={{ width: "18rem" }} key={p._id}>
                  <img
                    src={`/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top"
                    height={200}
                    alt={p.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text">
                      {p.description.substring(0, 30)}...
                    </p>
                    <p className="card-text"> $ {p.price}</p>
                    <Button
                      onClick={() => navigator(`/product/${p.slug}`)}
                    >
                      More Details
                    </Button>
                    <Button className="ms-1"
                      type="primary"
                      onClick={() => {
                        setCart([...cart, p])
                        toast.success("Product added to cart");
                      }}
                    >
                      ADD TO CART
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="m-2 p-3">
            {products.length < total && (
              <Button
                type="default"
                loading={loadingMore}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Load More
              </Button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
