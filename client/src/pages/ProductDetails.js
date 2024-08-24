import React, { useState, useEffect } from 'react';
import Layout from '../Components/Layout/Layout';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Spin, Card, Typography, Alert } from 'antd';

const { Title, Text } = Typography;

const ProductDetails = () => {
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [error, setError] = useState(null);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (params?.slug) {
      getProduct();
    }
  }, [params?.slug]);

  const getProduct = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/get-product/${params.slug}`);
      setProduct(data?.product);
      await getSimilarProducts(data?.product._id, data?.product.category._id);
    } catch (error) {
      setError("Error fetching product details.");
      console.error("Error fetching product:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const getSimilarProducts = async (pid, cid) => {
    try {
      setLoadingRelated(true);
      const { data } = await axios.get(`/api/v1/product/related-product/${pid}/${cid}`);
      setRelatedProducts(data?.products);
    } catch (error) {
      setError("Error fetching similar products.");
      console.error("Error fetching similar products:", error.message);
    } finally {
      setLoadingRelated(false);
    }
  };

  return (
    <Layout title={`Product Details`}>
      <div className="product-details-container">
        {loading ? (
          <div className="text-center"><Spin size="large" /></div>
        ) : (
          <div className='product-details-content bg-secondary bg-opacity-25'>
            <div className='row'>
              <div className='col-md-6'>
                <img
                  src={`/api/v1/product/product-photo/${product._id}`}
                  alt={product.name}
                  height={200}
                  width={200}
                  className='product-image'
                />
              </div>
              <div className='col-md-6'>
                <Title level={2} className='product-title'>Product Details</Title>
                <h2>
                  <b strong>Name: </b> <text>{product.name}</text><br />
                  <b strong>Price: </b> <text>${product.price}</text><br />
                  <b strong>Category: </b> <text>{product.category?.name}</text><br />
                </h2>
              </div>
            </div>

            < hr  className='mt-5'/>
            <div>
              <Title level={3} className='similar-products-title'>Similar Products</Title>
              {loadingRelated ? (
                <div className="text-center"><Spin size="small" /></div>
              ) : (
                <div className='row'>
                  {relatedProducts.length > 0 ? (
                    relatedProducts.map((product) => (
                      <div key={product._id} className='col-md-3 mb-3'>
                        <div className="card">
                          <img
                            alt={product.name}
                            src={`/api/v1/product/product-photo/${product._id}`}
                            className='card-img-top' 
                            height={200}
                            width={200}
                          />
                          <div className="card-body">
                            <div className="d-flex justify-content-between mb-2">
                              <div className="d-flex flex-column">
                                <h4 className="card-title">{product.name}</h4>
                                <h6 className="text-muted">{product.category?.name}</h6>
                              </div>
                              <h4 className="text-success text-end">₹{product.price*8}</h4>
                            </div>
                            <Button
                              onClick={() => navigate(`/product/${product.slug}`)}
                              aria-label={`View details of ${product.name}`}
                            >
                              More Details
                            </Button>
                            <Button
                              className="ms-1"
                              type="primary"
                              aria-label={`Add ${product.name} to cart`}
                            >
                              ADD TO CART
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <Text>No similar products found.</Text>
                  )
                }

                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetails;
