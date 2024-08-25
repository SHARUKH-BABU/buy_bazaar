import React, { useState, useEffect, useCallback, useMemo } from "react";
import Layout from "../Components/Layout/Layout";
import axios from "axios";
import { Checkbox, Radio, Spin, Button } from "antd";
import Prices from "../Components/Prices";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import useCategory from "../hooks/useCategory";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cart, setCart] = useCart();
  const Allcategories = useCategory();
  
  const navigator = useNavigate();
  const audio = new Audio('/sounds/add_to_cart.mp3'); // Updated path to your audio file

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const categoryData = await axios.get("/api/v1/category/get-category");
        const totalCount = await axios.get("/api/v1/product/product-count");
        const productData = await axios.get(`/api/v1/product/get-product`);
        setCategories(categoryData.data?.category);
        setTotal(totalCount.data?.total);
        setProducts(productData.data?.products);
      } catch (error) {
        toast.error("Error fetching initial data");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
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

  const getAllProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/v1/product/get-product`);
      setProducts(data?.products);
    } catch (error) {
      toast.error("Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setProducts((prevProducts) => [...prevProducts, ...data?.products]);
    } catch (error) {
      toast.error("Error loading more products");
    } finally {
      setLoadingMore(false);
    }
  };

  const filterProduct = useCallback(async () => {
    try {
      const { data } = await axios.post("/api/v1/product/product-filters", {
        checked,
        radio,
      });
      setProducts(data?.products);
    } catch (error) {
      toast.error("Error filtering products");
    }
  }, [checked, radio]);

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

  const categoryOptions = useMemo(
    () =>
      categories?.map((c) => (
        <Checkbox
          key={c._id}
          onChange={(e) => handleFilter(e.target.checked, c._id)}
          className="mb-2"
        >
          {c.name}
        </Checkbox>
      )),
    [categories]
  );

  const handleAddToCart = (product) => {
    setCart([...cart, product]);
    toast.success("Product added to cart");
    audio.play(); // Play sound when adding to cart
  };

  return (
    <Layout title={"All Products - Best offers"}>
      <div
        className="bg-secondary mt-3 bg-opacity-10 d-flex flex-wrap justify-content-around align-items-center h-auto"
        style={{ height: "120px" }}
      >
        {Allcategories?.map((c, index) => (
            <div
              key={c.slug}
              className="category-link-container mw-100 m-2"
            >
              <Link
                to={`/category/${c.slug}`}
                className="p-2 text-decoration-none text-secondary"
                aria-label={`View products in category ${c.name}`}
              >
                <h5>{c.name}</h5>
              </Link>
            </div>
        ))}
      </div>

      <div className="container-fluid row p-4">
        <div className="rounded p-3 col-md-3 p-2">
          <h4 className="text-center mb-4">Filter By Category</h4>
          <div className="d-flex flex-column">{categoryOptions}</div>
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
            aria-label="Reset filters"
          >
            RESET FILTERS
          </Button>
        </div>

        <div className="col-md-9">
          <h1 className="text-center">All Products</h1>
          {loading ? (
            <div className="text-center">
              <Spin />
            </div>
          ) : (
            <div className="d-flex flex-wrap">
              {products?.map((p) => (
                <div className="card m-2 p-2" style={{ width: "18rem" }} key={p._id}>
                  <img
                    src={`/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top"
                    height={200}
                    alt={p.name}
                    aria-label={`Product ${p.name}`}
                  />
                  <div className="card-body">
                    <div className="d-flex justify-content-between mb-2">
                      <div className="d-flex flex-column">
                        <h4 className="card-title">{p.name}</h4>
                        <h6 className="text-muted">{p.category?.name}</h6>
                      </div>
                      <h4 className="text-success text-end">₹{p.price*8}</h4>
                    </div>
                    <div className="d-flex justify-content-between">
                      <Button
                        onClick={() => navigator(`/product/${p.slug}`)}
                        aria-label={`View details of ${p.name}`}
                      >
                        More Details
                      </Button>
                      <Button
                        className="bg-success"
                        type="primary"
                        onClick={() => handleAddToCart(p)}
                        aria-label={`Add ${p.name} to cart`}
                      >
                        ADD TO CART
                      </Button>
                    </div>
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
                aria-label="Load more products"
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
