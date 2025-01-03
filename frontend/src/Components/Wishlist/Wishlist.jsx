import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Wishlist/Wishlist.scss'; // Add your styles here

const Wishlist = ({ setUser, setLogin }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const value = localStorage.getItem('Auth'); // Get token from localStorage
  const navigate = useNavigate();

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
      console.error("Error fetching details:", error);
    }
  };

  // Fetch wishlist from the server
  useEffect(() => {
    fetchWishlist();
    getDetails();
  }, [value]); // Fetch wishlist whenever the component mounts or token changes
  const fetchWishlist = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/getwishlist', {
        headers: { 'Authorization': `Bearer ${value}` },
      });
      if (res.status === 201) {
          console.log(res);
        setWishlist(res.data); // Set the fetched wishlist
      } else {
        alert('Error fetching wishlist');
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      alert('Failed to fetch wishlist');
    } finally {
      setLoading(false); // Stop loading once data is fetched
    }
  };

  // Handle removing an item from the wishlist
  const handleRemoveFromWishlist = async (productId) => {
    try {
      console.log(productId);
      
      const res = await axios.delete(`http://localhost:3000/api/removefromwishlist/${productId}`, {
        headers: { 'Authorization': `Bearer ${value}` },
      });
      if (res.status === 201) {

        setWishlist(wishlist.filter(item => item.productId._id !== productId));
        alert('Product removed from wishlist');
        fetchWishlist();
        
      } else {
        alert('Error removing product from wishlist');
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      alert('Failed to remove product from wishlist');
    }
  };
console.log(wishlist);

  // Navigate to product details page
  const goToProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="wishlist">
      <h1>Your Wishlist</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="wishlist-items">
          {wishlist.length === 0 ? (
            <p>Your wishlist is empty.</p>
          ) : (
            wishlist.map(item => {
              console.log(item.productId.pimages); // Log the images to see what's being fetched

              return (
                
                <div key={item.productId._id} className="wishlist-item">
                  <img
                    src={"" || 'path/to/default-image.jpg'} // Fallback image
                    alt={item.productId.pname}
                    onClick={() => goToProduct(item.productId._id)}
                    className="product-image"
                  />
                  <div className="product-info">
                    <h2>{item.pname}</h2>
                    <p>Brand: {item.productId.brand}</p>
                    <p>Price: ₹{item.price}</p>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveFromWishlist(item.productId)}
                  >
                    Remove from Wishlist
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default Wishlist;