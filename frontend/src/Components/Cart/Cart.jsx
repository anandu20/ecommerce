import React, { useState, useEffect } from 'react';
import './Cart.scss';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const Cart = ({ setUser, setLogin }) => {

  const { id } = useParams();
  const navigate = useNavigate();
  const value = localStorage.getItem('Auth');
  
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState(''); // To show success or error messages

  useEffect(() => {
    getDetails();
    getAllProducts();
  }, []);

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

  const getAllProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/getcart", {
        headers: { "Authorization": `Bearer ${value}` },
      });
      if (res.status === 201) {
        setCartItems(res.data);
      } else {
        alert("Failed to fetch cart");
      }
    } catch (error) {
      console.error("Error fetching cart items", error);
      alert("Failed to fetch cart");
    }
  };

  // Update quantity of an item in the cart
  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;  // Prevent negative quantity

    try {
      // Optimistically update the local state first
      setCartItems(prevItems =>
        prevItems.map(item =>
          item._id === id ? { ...item, quantity: newQuantity } : item
        )
      );

      // Now send the update to the backend
      const res = await axios.put(
        `http://localhost:3000/api/updatecart/${id}`,
        { quantity: newQuantity },
        { headers: { "Authorization": `Bearer ${value}` } }
      );

      if (res.status !== 201) {
        // If the backend request fails, reset the state to the original value
        getAllProducts();  // Fetch the latest data again
      }
    } catch (error) {
      console.error("Error updating quantity", error);
      getAllProducts();  // Fetch the latest data again
    }
  };

  const handleProceedToCheckout = async () => {
    try {
      const orderItems = cartItems.map(item => ({
        productId:item.productId,     
        quantity: item.quantity,  
        sizee: item.size,         
        housename: item.housename || "Default House", // House name, default to "Default House"
        totalPrice: (item.quantity * item.price).toString(),  // Calculate total price for each item
      }));

      // Make the request to the backend to add all orders
      const resAddToOrders = await axios.post("http://localhost:3000/api/addallorders", orderItems, {
        headers: { "Authorization": `Bearer ${value}` }, // Pass authorization token
      });

      if (resAddToOrders.status === 201) {
        alert("Success! Your order has been placed.");
        setCartItems([]); 
        navigate("/")
      } else {
        alert('Error processing checkout');
      }
    } catch (error) {
      console.error('Error during checkout', error);
      alert('Failed to proceed with checkout');
    }
  };

  const handleBuyNow = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:3000/api/deletecart/${id}`);
      if (res.status === 201) {
        alert("Product Purchased");

        getAllProducts();
      } else {
        alert("Error purchasing product");
      }
    } catch (error) {
      console.error("Error purchasing product", error);
      alert("Error purchasing product");
    }
  };

  // Calculate total price of cart
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="cart">
      <div className="cart-container">
        <h1>Your Cart</h1>
        {message && <div className="success-message">{message}</div>}

        <div className="cart-items">
          {cartItems.length === 0 ? (
      
            <p>  Cart is empty.</p>
             // Show empty cart message if no items
          ) : (
            cartItems.map((item) => (
              <div className="cart-item" key={item._id}>
                <img
                  src={item.pimages && item.pimages.length > 0 ? item.pimages[0] : 'https://via.placeholder.com/150'}
                  alt={item.pname}
                  className="cart-item-image"
                />
                <div className="cart-item-info">
                  <h2 className="cart-item-name">Name: {item.pname}</h2>
                  <p className="cart-item-price">₹{item.price}</p>
                


                  {/* Quantity Controls */}
                  <div className="quantity-controls">
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="quantity-display">{item.quantity || 1}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <button className="buy-now-btn" onClick={() => handleBuyNow(item._id)}>
                    Buy Now
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

         <div className="cart-footer">
          <div className="total-price">
            <p>Total: ₹{calculateTotal()}</p> {/* Display calculated total */}
        {/* <p>40% Discount Added</p>
            <p>COUPONS FOR YOU APPLIED</p> */}
          </div>            

          {/* Proceed to Checkout Card Button */}
          <div className="checkout-card">
            <button className="proceed-btn" onClick={handleProceedToCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;    