import React, { useState, useEffect } from 'react';
import '../Cart/Cart.scss';
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
        productId: item.productId,     
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

  // Calculate total price of cart, apply discount or delivery charge
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      let itemTotal = item.price * item.quantity;
      // Apply 40% discount if quantity is more than 2
      if (item.quantity > 2) {
        itemTotal = itemTotal * 0.6; // Apply 40% discount (60% of the price)
      } else {
        itemTotal += 40; // Add ₹40 delivery charge if quantity is 2 or less
      }
      return total + itemTotal;
    }, 0);
  };

  return (
    <div className="cart">
      <div className="cart-container">
        <div className="cart-items">
          {message && <div className="success-message">{message}</div>}

          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p> // Show empty cart message if no items
          ) : (
            cartItems.map((item) => (
              <div className="cart-item" key={item._id}>
                <img
                  src={item.pimages && item.pimages.length > 0 ? item.pimages[0] : 'https://via.placeholder.com/150'}
                  alt={item.pname}
                  className="cart-item-image"
                />
                <div className="cart-item-info">
                  <h2 className="cart-item-name">{item.pname}</h2>
                  <h2 className="cart-item-name">Size - {item.size}</h2>
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
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right-Aligned Price Details Card */}
        <div className="cart-footer-right">
          <div className="total-price">
            <h4>Price Details</h4>
            <div className="price-summary">
              <div className="price-item">
                <p>Total Price ({cartItems.length} items)</p>
                <p>₹{calculateTotal()}</p>
              </div>
              <div className="price-item">
                <p>Delivery Charge</p>
                <p style={{color:"green"}}>₹40</p>
              </div>
              <div className="price-item">
                <p>Discount Applied (40%)</p>
                <p style={{color:"green"}}>-₹{calculateTotal() * 0.4}</p>
              </div>
              <div className="price-item">
                <p>Coupon Discount</p>
                <p style={{color:"green"}}>-₹100</p> {/* Assuming a fixed ₹100 discount for demonstration */}
              </div>
            </div>

            <div className="final-price">
              <p>Final Price</p>
              <h3>₹{calculateTotal() - (calculateTotal() * 0.4) - 100 + 40}</h3> {/* Final Price after discount and delivery charge */}
            </div>
          </div>

          {/* Place Order Button */}
          <div className="checkout-card">
            <button className="proceed-btn" onClick={handleProceedToCheckout}>
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;