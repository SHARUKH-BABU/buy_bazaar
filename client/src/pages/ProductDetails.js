import React, { useState, useEffect } from 'react';
import Layout from '../Components/Layout/Layout';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Spin, Typography } from 'antd';
import { useCart } from '../context/cart'; // Import the cart context
import toast from 'react-hot-toast';

const { Title, Text } = Typography;

const ProductDetails = () => {
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [error, setError] = useState(null);
  const params = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useCart(); // Get the cart and setCart from context
  const audio = new Audio('/sounds/add_to_cart.mp3'); // Add path to audio

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

  const handleAddToCart = (product) => {
    setCart([...cart, product]); // Add the product to the cart
    toast.success(`${product.name} added to cart!`); // Show success toast
    audio.play(); // Play sound on add to cart
  };

  return (
    <Layout title={`Product Details`}>
      <div className="product-details-container">
        {loading ? (
          <div className="text-center"><Spin size="large" /></div>
        ) : (
          <div className='product-details-content '>
            <div className=' d-flex flex-wrap'>
              <img
                src={`/api/v1/product/product-photo/${product._id}`}
                alt={product.name}
                style={{ objectFit: 'contain' }}
                className='product-image'
              />
              <div>
                <Title level={1} className='product-title'>PRODUCT DETAILS</Title>
                <h2>
                  <b>Name: </b> {product.name}<br />
                  <b>Price: </b> ₹{product.price * 8}<br />
                  <b>Category: </b> {product.category?.name}<br />
                </h2>
                <Button
                  className="mt-3 bg-success"
                  type="primary"
                  onClick={() => handleAddToCart(product)}
                  aria-label={`Add ${product.name} to cart`}
                >
                  ADD TO CART
                </Button>
              </div>
            </div>

            <hr className='mt-5' />
            <div>
              <Title level={3} className='similar-products-title'>Similar Products</Title>
              {loadingRelated ? (
                <div className="text-center"><Spin size="small" /></div>
              ) : (
                <div className='row'>
                  {relatedProducts.length > 0 ? (
                    relatedProducts.map((relatedProduct) => (
                      <div key={relatedProduct._id} className='col-md-3 mb-3'>
                        <div className="card">
                          <img
                            alt={relatedProduct.name}
                            src={`/api/v1/product/product-photo/${relatedProduct._id}`}
                            className='card-img-top' 
                            height={200}
                          />
                          <div className="card-body">
                            <div className="d-flex justify-content-between mb-2">
                              <div className="d-flex flex-column">
                                <h4 className="card-title">{relatedProduct.name}</h4>
                                <h6 className="text-muted">{relatedProduct.category?.name}</h6>
                              </div>
                              <h4 className="text-success text-end">₹{relatedProduct.price*8}</h4>
                            </div>
                            <div className='d-flex justify-content-between'>
                              <Button
                                onClick={() => navigate(`/product/${relatedProduct.slug}`)}
                                aria-label={`View details of ${relatedProduct.name}`}
                              >
                                More Details
                              </Button>
                              <Button
                                className="ms-1"
                                type="primary"
                                onClick={() => handleAddToCart(relatedProduct)}
                                aria-label={`Add ${relatedProduct.name} to cart`}
                              >
                                ADD TO CART
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <Text>No similar products found.</Text>
                  )}
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
