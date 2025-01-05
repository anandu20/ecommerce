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

            if (res.status === 201) {
                const mergedOrders = res.data.products.map((order, index) => {
                    // Merge order with corresponding order details
                    const orderDetail = res.data.order[index];  // Assuming order and orderDetails arrays are in sync
                    return { ...order, orderDetail };
                });
                setOrders(mergedOrders);  // Set merged orders with details
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

    return (
        <div className="my-orders">
            {/* Display Loading */}
            {loading && <p className="loading">Loading orders...</p>}

            {/* Display Error */}
            {error && <p className="error">{error}</p>}

            {/* Display Orders if available */}
            {!loading && !error && orders.length > 0 ? (

            
                <div className="orders-container">
                    <div className="odr">
                        <h1>NAME</h1>
                        <h1>BRAND</h1>
                        <h1>PRICE</h1>
                        <h1>QUANTITY</h1>
                        <h1>TOTAL</h1>

                    </div>
                    {orders.map((order) => (
                        <div className="order-item" key={order.id}>
                            <div className="order-image">
                                {/* Use the correct image source */}
                                {order.pimages && order.pimages.length > 0 ? (
                                    <img src={order.pimages[0]} alt={order.pname} />
                                ) : (
                                    <p>No image available</p>
                                )}
                            </div>
                            <div className="order-info">
                                <h3>{order.pname}</h3>
                                <p className="brand">Brand: {order.brand}</p>
                                <p className="price">Price: ₹{order.price}</p>

                                {/* Display quantity and totalPrice from `orderDetail` if available */}
                                {order.orderDetail ? (
                                    <>
                                        <p className="quantity">Quantity: {order.orderDetail.quantity}</p>
                                        <p className="total-price">Total: ₹{order.orderDetail.totalPrice}</p>
                                    </>
                                ) : (
                                    <p className="error">Details not available</p>
                                )}
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