import React, { useEffect, useState } from 'react';
import '../Product/Product.scss';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const Product = ({ setUser, setLogin }) => {
  const { id } = useParams();
  const navigate = useNavigate();  // To navigate programmatically
  const value = localStorage.getItem('Auth');
  const [products, getProducts] = useState({});
  const [mainImage, setMainImage] = useState('');
  const [isInCart, setIsInCart] = useState(false);  // To track if the product is in the cart

  useEffect(() => {
    getDetails();
    getProduct();
  }, [id]);

  const getDetails = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/seller", {
        headers: { "Authorization": `Bearer ${value}` },
      });
      if (res.status === 201) {
        setUser(res.data.username);
        setLogin(res.data.accounttype);
      } else {
        alert("Error fetching seller details");
      }
    } catch (error) {
      console.error("Error fetching seller details", error);
      alert("Failed to fetch seller details");
    }
  };

  const getProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/getproducte/${id}`);
      if (res.status === 201) {
        getProducts(res.data);
        // setMainImage(res.data.pimages[0]);
      } else {
        alert("Error fetching product details");
      }
    } catch (error) {
      console.error("Error fetching product details", error);
      alert("Failed to fetch product details");
    }
  };

  const handleThumbnailClick = (image) => {
    setMainImage(image);
  };

  const AddProduct = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/addtocart",
        { pname: products.pname, price: products.price,pimages:products.pimages,productId:products._id},
        { headers: { "Authorization": `Bearer ${value}` } }
      );
      if (res.status === 201) {
        setIsInCart(true);  // Product added to cart
        alert("Product added to cart");
      } else {
        alert("Failed to add product to cart");
      }
    } catch (error) {
      console.error("Error adding product to cart", error);
      alert("Error adding product to cart");
    }
  };

  const goToCart = () => {
    navigate("/cart");  // Navigate to the cart page
  };

  return (
    <div className="product">
      <div className="product-container">

        {/* Left side with images */}
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

        {/* Right side with product info */}
        <div className="right">
          <h1 className="title">{products.pname}</h1>
          <div className="brand">Brand: <span>{products.brand}</span></div>
          <div className="price">${products.price}</div>
          <div className="description">
            <p>Category: {products.category}</p>
            <p>{products.size}</p>

          </div>    
          <div className="buttons">
            {/* Button behavior changes depending on isInCart state */}
            {isInCart ? (
              <button onClick={goToCart} className="go-to-cart">
                Go to Cart
              </button>
            ) : (
              <button onClick={AddProduct} className="add-to-cart">
                Add to Cart
              </button>
            )}
            <button className="buy-now-btn">Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;