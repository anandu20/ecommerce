import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './MyOrders.scss';


const MyOrders = ({ setUser, setLogin }) => {
    const [orders, setOrders] = useState([]); // Stores the orders and their details combined
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const value = localStorage.getItem('Auth');

    useEffect(() => {
        getData();
        getDetails();
    }, []);

    const getData = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/getorders', {
                headers: { 'Authorization': `Bearer ${value}` },
            });

            if (res.status === 201) { // Status code should be 200 for success
                console.log(res);
                
                console.log(res.data.order);
                
                setOrders(res.data.order || []); // Ensure 'order' is correct; log to check
                setLoading(false);
            } else {
                setError('Failed to fetch orders');
                setLoading(false);
            }
        } catch (err) {
            setError('Error fetching orders');
            setLoading(false);
            console.error(err);
        }
    };

    const getDetails = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/seller', {
                headers: { 'Authorization': `Bearer ${value}` },
            });

            if (res.status === 201) { // Fixed status code to 200
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

    return (
        <div className="my-orders">
            {loading && <p className="loading">Loading orders...</p>}
            {error && <p className="error">{error}</p>}

            {!loading && !error && orders.length > 0 ? (
                <div className="orders-container">
                    {orders.map((order) => (
                        <div className="order-item" key={order.id}>
                            <div className="order-image">
                                {order.product && order.product.pimages && order.product.pimages.length > 0 ? (
                                    <img src={order.product.pimages[0]} alt={order.product.pname || 'Product image'} />
                                ) : (
                                    <p>No image available</p>
                                )}
                            </div>
                            <div className="order-info">
                                <h3>{order.product.pname || 'no product'}</h3> {/* Fallback for pname */}
                                <p className="brand">Brand: {order.product.brand || 'Brand not available'}</p> {/* Fallback for brand */}
                                <p className="price">Price: ₹{order.product.price || '0'}</p> {/* Fallback for price */}
                                <p className="price"> Quantity :{order.quantity}</p>
                                <p className="price"> Total Price :{order.totalPrice}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                !loading && <p>No orders found.</p>
            )}
        </div>
    );
};

export default MyOrders;