import React, { useState, useEffect } from 'react';
import Layout from '../Components/Layout/Layout';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Typography } from 'antd';
import { useCart } from '../context/cart'; // Import the cart context
import toast from 'react-hot-toast';
import { Spin } from 'antd';

const { Title, Text } = Typography;

const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useCart(); // Use cart context

  const audio = new Audio('/sounds/add_to_cart.mp3'); // Updated path to your audio file

  useEffect(() => {
    if (params?.slug) {
      getProductsByCat();
    }
  }, [params?.slug]);

  const getProductsByCat = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-category/${params.slug}`);
      setProducts(data?.products);
      setCategory(data?.category);
    } catch (error) {
      setError("Error fetching products.");
      console.error("Error fetching products:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
    toast.success(`${product.name} added to cart`);
    audio.play();
  };

  return (
    <Layout>
      <div className="container mt-3">
        <Title level={4} className="text-center">Category - {category?.name}</Title>
        <Text className='text-center'>{products?.length} result found </Text>
        <hr />
        {loading ? (
          <div className="text-center"><Spin size="large" /></div>
        ) : (
          <div className='row'>
            <div className='col-md-9 offset-1'>
              <div className="d-flex flex-wrap ">
                {products.length > 0 ? (
                  products.map((p) => (
                    <div
                      className="card m-2"
                      style={{ width: "18rem" }}
                      key={p._id}
                    >
                      <img
                        src={`/api/v1/product/product-photo/${p._id}`}
                        className="card-img-top"
                        alt={p.name}
                        height={200}
                        width={200}
                      />
                      <div className="card-body">
                        <div className="d-flex justify-content-between mb-2">
                          <div className="d-flex flex-column">
                            <h4 className="card-title">{p.name}</h4>
                            <Text className="card-text">
                              {p.description.substring(0, 30)}...
                            </Text>
                          </div>
                          <h4 className="text-success text-end">₹{p.price*8}</h4>
                        </div>
                        <Button
                          className="mt-2"
                          type="primary"
                          onClick={() => navigate(`/product/${p.slug}`)}
                          aria-label={`More details of ${p.name}`}
                        >
                          More Details
                        </Button>
                        <Button
                          className="mt-2 ms-1 bg-success"
                          type="primary"
                          onClick={() => handleAddToCart(p)}
                          aria-label={`Add ${p.name} to cart`}
                        >
                          ADD TO CART
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <Text>No products found in this category.</Text>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CategoryProduct;
