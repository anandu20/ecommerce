
import React from 'react';
import '../Success/Success.scss';
import {Link } from 'react-router-dom';

const PurchaseSuccess = () => {
  return (
    <div className="purchase-success">
      <div className="success-container">
        <h1 className="success-heading">Purchase Successful!</h1>
        <div className="success-message">
          <p>Your purchase of PRODUCTwas completed successfully!</p>
          <p>Thank you for shopping with us. Your order is being processed and will be shipped soon.</p>
        </div>
    
    <Link to={'/`'}>
        <button className="continue-shopping">
          Continue Shopping
        </button>
    </Link>
      </div>
    </div>
  );
};

export default PurchaseSuccess;
