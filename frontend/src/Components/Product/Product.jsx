import React, { useEffect, useState } from 'react';
import '../Product/Product.scss';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Product = ({ setUser, setLogin }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const value = localStorage.getItem('Auth');
  const [products, getProducts] = useState({});
  const [mainImage, setMainImage] = useState('');
  const [isInCart, setIsInCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [cart, setCart] = useState({
    products: {},
    size: "",
    quantity: 0
  });

  useEffect(() => {
    getDetails();
    getProduct();
  }, [id]);

  const getDetails = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/seller', {
        headers: { 'Authorization': `Bearer ${value}` },
      });
      if (res.status === 201) {
        setUser(res.data.username);
        setLogin(res.data.accounttype);
      } else {
        alert('Error fetching seller details');
      }
    } catch (error) {
      console.error('Error fetching seller details', error);
      alert('Failed to fetch seller details');
    }
  };

  const getProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/getproducte/${id}`);
      if (res.status === 201) {
        getProducts(res.data);
        setMainImage(res.data.pimages[0]);
        checkIfProductInCart(res.data._id);
        checkIfProductInWishlist(res.data._id);
      } else {
        alert('Error fetching product details');
      }
    } catch (error) {
      console.error('Error fetching product details', error);
      alert('Failed to fetch product details');
    }
  };

  const checkIfProductInCart = async (productId) => {
    try {
      const res = await axios.get('http://localhost:3000/api/getcart', {
        headers: { 'Authorization': `Bearer ${value}` },
      });
      if (res.status === 201) {
        const productInCart = res.data.some(item => item.productId === productId);
        setIsInCart(productInCart);
      } else {
        alert('Error fetching cart details');
      }
    } catch (error) {
      console.error('Error checking cart for product', error);
      alert('Failed to check cart for product');
    }
  };

  const checkIfProductInWishlist = async (productId) => {
    try {
      const res = await axios.get('http://localhost:3000/api/getwishlist', {
        headers: { 'Authorization': `Bearer ${value}` },
      });
      if (res.status === 201) {
        const productInWishlist = res.data.some(item => item.productId === productId);
        setIsInWishlist(productInWishlist);
      } else {
        alert('Error fetching wishlist details');
      }
    } catch (error) {
      console.error('Error checking wishlist for product', error);
      alert('Failed to check wishlist for product');
    }
  };

  const handleThumbnailClick = (image) => {
    setMainImage(image);
  };

  const AddProduct = async () => {
    if (!cart.size) {
      alert('Please select a size');
      return;
    }
    try {
      const res = await axios.post(
        'http://localhost:3000/api/addtocart',
        {
          pname: products.pname,
          price: products.price,
          pimages: products.pimages,
          quantity: cart.quantity,
          productId: products._id,
          size: cart.size
        },
        { headers: { 'Authorization': `Bearer ${value}` } }
      );
      if (res.status === 201) {
        setIsInCart(true);
        alert('Product added to cart');
      } else {
        alert('Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error adding product to cart', error);
      alert('Error adding product to cart');
    }
  };

  const toggleWishlist = async () => {
    try {
      if (isInWishlist) {
        const res = await axios.delete(
          `http://localhost:3000/api/removefromwishlist/${products._id}`,
          { headers: { 'Authorization': `Bearer ${value}` } }
        );
        if (res.status === 201) {
          setIsInWishlist(false);
          alert('Product removed from wishlist');
        }
      } else {
        const res = await axios.post(
          'http://localhost:3000/api/addtowishlist',
          { productId: products._id, pname: products.pname, price: products.price, pimages: products.pimages, brand: products.brand },
          { headers: { 'Authorization': `Bearer ${value}` } }
        );
        if (res.status === 201) {
          setIsInWishlist(true);
          alert('Product added to wishlist');
        }
      }
    } catch (error) {
      console.error('Error adding/removing product from wishlist', error);
      alert('Error managing wishlist');
    }
  };

  const handleSize = (size) => {
    setCart(prevCart => ({
      ...prevCart,
      size: size,
      products: products,
      quantity: 1
    }));
  };

  const goToCart = () => {
    navigate('/cart');
  };

  const Buy = () => {
    if (!cart.size) {
      alert('Please select a size');
      return;
    }
    navigate(`/orders/${products._id}`);
  };

  return (
    <div className="product">
      <div className="product-container">
        <div className="left">
          <div className="main-image">
            <img src={mainImage} alt="Main Product" />
          </div>
          <div className="thumbnail-images">
            {products.pimages && products.pimages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Thumbnail ${index + 1}`}
                onClick={() => handleThumbnailClick(image)}
                className="thumbnail"
              />
            ))}
          </div>
        </div>
        <div className="right">
          <h1 className="title">{products.pname}</h1>
          <div className="brand">Brand: <span>{products.brand}</span></div>
          <div className="price">₹{products.price}</div>
          <div className="description">
            <p>{products.category}</p>
          </div>
          <div className="size-options">
            <strong>Select Size:</strong>
            <div className="size-choices">
              {products.size &&
                Object.keys(products.size).map((size) => (
                  <button
                    key={size}
                    className={`size-btn ${cart.size === size ? 'active' : ''}`}
                    onClick={() => handleSize(size)}
                    disabled={products.size[size] <= 0}
                  >
                    {size}
                  </button>
                ))}
            </div>
          </div>
          <div className="wishlist" onClick={toggleWishlist}>
            {isInWishlist ? (
              <span className="heart-filled">❤️</span>
            ) : (
              <span className="heart-empty">🤍</span>
            )}
          </div>
          <div className="buttons">
            {isInCart ? (
              <button onClick={goToCart} className="go-to-cart">
                Go to Cart
              </button>
            ) : (
              <button onClick={AddProduct} className="add-to-cart">
                Add to Cart
              </button>
            )}
            <button className="buy-now-btn" onClick={Buy}>Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
