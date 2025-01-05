import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import '../Orders/Orders.scss'; // Ensure to add appropriate styles in this file
import { FiMinus, FiPlus } from 'react-icons/fi';

const Orders = ({ setUser, setLogin }) => {
  const navigate=useNavigate()
  const value = localStorage.getItem('Auth');
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [addresses, setAddresses] = useState([]); // State for addresses
  const [selectedAddress, setSelectedAddress] = useState(''); // State for selected address

  useEffect(() => {
    getProductDetails();
    getDetails();
    getAddresses(); // Fetch addresses on component mount
  }, [id, setUser, setLogin, value]);

  const getProductDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/getorder/${id}`);
      
      
      setProduct(res.data);
      console.log(res.data);
      setQuantity(res.data.quantity); // Initial quantity of the product
    } catch (error) {
      console.error('Error fetching product details:', error);
      alert('Failed to fetch product details');
    }
  };

  const getDetails = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/seller', {
        headers: { 'Authorization': `Bearer ${value}` },
      });
      if (res.status === 201) { // Fixed status code to 200 for successful fetch
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

  const getAddresses = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/getaddress', {
        headers: { 'Authorization': `Bearer ${value}` },
      });
      // console.log('Fetched Addresses:', res.data); // Log the full response to check structure
      if (res.status === 201) { // Fixed status code to 200 for successful fetch
        // Assuming the structure is { address: [{_id, details}, ...] }
        setAddresses(res.data.address || []);
        // console.log(res.data.address); // Verify the addresses format
      } else {
        alert('Error fetching addresses');
      }
    } catch (error) {
      console.error('Error fetching addresses', error);
      alert('Failed to fetch addresses');
    }
  };

  const handleQuantityChange = async (id, type) => {
    setQuantity((prevQuantity) => {
      const updatedQuantity = type === 'increase' ? prevQuantity ++ : Math.max(prevQuantity --, 0); // Ensure quantity doesn't go below 0

      // Make the API call to update the quantity
      axios.post(
        'http://localhost:3000/api/editquantity',
        { id, quantity: updatedQuantity, type },
        { headers: { "Authorization": `Bearer ${value}` } }
      ).then(({ status }) => {
        if (status === 201) {  // Fixed status code to 200 for successful update
          getProductDetails(); // Refresh product details
        }
      }).catch(error => {
        console.error('Error updating quantity:', error);
        alert('Failed to update quantity');
      });

      return updatedQuantity; // Return the updated quantity
    });
  };

  // Calculate the price with discount or delivery charge
  const calculatePrice = () => {
    let price = product.price * quantity;
    if (quantity > 2) {
      price = price * 0.8; // Apply 20% discount
    }
    return price;
  };

  // Calculate delivery charge ( if applicable)
  const calculateDeliveryCharge = () => {
    return quantity <= 2 ? 40 : 0; // ₹40 delivery charge if quantity is 2 or less
  };
  console.log(product);
  
  const buyProduct = async () => {
    try {
      // Add the product to the orders
      const orderResponse = await axios.post(
        'http://localhost:3000/api/addorder', 
        {
          productId: product.productId,
          quantity,
          sizee:product.size,
          housename: selectedAddress,
          totalPrice: calculatePrice() + calculateDeliveryCharge(), 
        },
        { headers: { 'Authorization': `Bearer ${value}` } }
      );
  
      if (orderResponse.status === 201) {
        console.log('Product added to orders:', orderResponse.data);
        
        const removeCartResponse = await axios.delete(
          `http://localhost:3000/api/deletecart/${product._id}`, 
          { headers: { 'Authorization': `Bearer ${value}` } }
        );
  
        if (removeCartResponse.status === 201) {
          console.log('Product removed from cart:', removeCartResponse.data);
  
         
          // Optionally: Redirect the user to the orders page or show an order confirmation message
          alert('Order placed successfully! Product removed from cart.');
          navigate('/success')
          // Optionally, you can redirect the user or update state here to reflect changes.
        } else {
          alert('Error removing product from cart.');
        }
      } else {
        alert('Error placing order.');
      }
    } catch (error) {
      console.error('Error during the purchase process:', error);
      alert('Failed to complete the purchase. Please try again.');
    }
  };

  return (
    <div className="order-page">
      {product ? (
        <div className="product-details">
          <div className="product-left">
            {/* Left side: Product details */}
            <div className="product-image-section">
              <img src={product.pimages[0]} alt="Product" className="product-image" />
            </div>
            <div className="product-info">
              <h2 className="product-name">{product.pname}</h2>
              <p className="product-brand">Brand: {product.brand}</p>
              <div className="quantity-selection">
                <h5>Quantity</h5>
                <div className="quantity">
                  <span
                    className="decrease"
                    onClick={() => handleQuantityChange(product._id, 'decrease')}
                  >
                    <FiMinus size={24} />
                  </span>
                  <span className="quantity-text">{quantity}</span>
                  <span
                    className="increase"
                    onClick={() => handleQuantityChange(product._id, 'increase')}
                  >
                    <FiPlus size={24} />
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="product-right">
            {/* Right side: Price, Address selection, and Proceed to Buy */}
            {quantity <= 2 && (
              <h3 className="delivery-charge">
                Delivery Charge: ₹40
              </h3>
            )}
            <h3>Offer: 20% Applied</h3>
            <h3>Coupons for You Applied</h3>
            <h2 className="product-price">
              Price: ₹{calculatePrice()}
            </h2>

            <div className="address-selection">
              <h3>Select Delivery Address</h3>
              {addresses && addresses.length > 0 ? (
                addresses.map((address) => (
                  <div key={address.housename} className="address-option">
                    <input
                      type="radio"
                      id={address.housename}  // Ensure you use the correct identifier
                      name="address"
                      value={address.housename}
                      checked={selectedAddress === address.housename}
                      onChange={() => setSelectedAddress(address.housename)}
                    />
                    <label htmlFor={address.housename}>{address.housename}</label>  {/* Access the correct property */}

                  </div>
                ))
              ) : (
                <p>No addresses available.</p>
              )}
            </div>

            <button className="add-to-cart-btn" onClick={buyProduct}>
              Proceed to BUY
            </button>
          </div>
        </div>
      ) : (
        <p>Loading product details...</p>
      )}
    </div>
  );
};

export default Orders;

// const handleCart = async () => {
//   const { status, data } = await axios.post(`${route()}buynow`, { id: pid }, { headers: { "Authorization": `Bearer ${value}` } });
//   if (status === 201) {
//       alert(data.msg);
//       if(data.msg=="success")
//           navigate('/purchasecompleted')
//   }
// };
// <div className="payment-button">
//                                 <button onClick={handleCart}>Place Order</button>
//                             </div>